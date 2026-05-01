from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field


DEFAULT_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.1')
DEFAULT_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://127.0.0.1:11434')


class ReviewInput(BaseModel):
    body: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    cost: int | None = Field(default=None, ge=1, le=5)
    cleanliness: int | None = Field(default=None, ge=1, le=5)
    location: int | None = Field(default=None, ge=1, le=5)
    management: int | None = Field(default=None, ge=1, le=5)


class SummaryRequest(BaseModel):
    name: str
    address: str | None = None
    reviews: list[ReviewInput] = Field(default_factory=list)


app = FastAPI(title='UWHousingFlow Review Summary API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


def average(values: list[int]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)


def format_average(label: str, values: list[int]) -> str | None:
    value = average(values)
    if value is None:
        return None
    return f'{label}: {value:.1f}/5'


def build_review_digest(reviews: list[ReviewInput]) -> str:
    digest_lines: list[str] = []

    for index, review in enumerate(reviews[:12], start=1):
        details: list[str] = []

        if review.rating is not None:
            details.append(f'overall {review.rating}/5')
        if review.cost is not None:
            details.append(f'cost {review.cost}/5')
        if review.cleanliness is not None:
            details.append(f'cleanliness {review.cleanliness}/5')
        if review.location is not None:
            details.append(f'location {review.location}/5')
        if review.management is not None:
            details.append(f'management {review.management}/5')

        comment = (review.body or 'No written comments provided.').strip().replace('\n', ' ')
        if details:
                        digest_lines.append(f'{index}. {comment} ({", ".join(details)})')
        else:
                        digest_lines.append(f'{index}. {comment}')

    return '\n'.join(digest_lines)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/api/house-summary')
def house_summary(payload: SummaryRequest) -> dict[str, Any]:
    if not payload.reviews:
        return {'summary': '', 'review_count': 0}

    rating_values = [review.rating for review in payload.reviews if review.rating is not None]
    cost_values = [review.cost for review in payload.reviews if review.cost is not None]
    cleanliness_values = [review.cleanliness for review in payload.reviews if review.cleanliness is not None]
    location_values = [review.location for review in payload.reviews if review.location is not None]
    management_values = [review.management for review in payload.reviews if review.management is not None]

    average_lines = [
        line
        for line in [
            format_average('Overall average', rating_values),
            format_average('Cost', cost_values),
            format_average('Cleanliness', cleanliness_values),
            format_average('Location', location_values),
            format_average('Management', management_values),
        ]
        if line is not None
    ]

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                'system',
                'You summarize housing reviews for a prospective tenant. Return exactly 2 short sentences, plain text only, no bullets, no markdown, and no invented facts. Highlight common themes, recurring positives, recurring negatives, and overall sentiment.',
            ),
            (
                'human',
                'House: {name}\nAddress: {address}\nReview count: {review_count}\nAverage ratings:\n{average_block}\n\nWritten reviews:\n{review_digest}\n\nWrite the overview now.',
            ),
        ]
    )

    model = ChatOllama(
        model=DEFAULT_MODEL,
        base_url=DEFAULT_BASE_URL,
        temperature=0.2,
    )

    chain = prompt | model | StrOutputParser()

    try:
        summary = chain.invoke(
            {
                'name': payload.name,
                'address': payload.address or '',
                'review_count': len(payload.reviews),
                'average_block': '\n'.join(average_lines),
                'review_digest': build_review_digest(payload.reviews),
            }
        ).strip()
    except Exception as exc:  # pragma: no cover - surfaced to frontend as a 503
        raise HTTPException(status_code=503, detail='Ollama summary generation failed') from exc

    return {'summary': summary, 'review_count': len(payload.reviews), 'model': DEFAULT_MODEL}