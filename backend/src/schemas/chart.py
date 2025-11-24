from typing import List
from pydantic import Field
from langchain_core.output_parsers.pydantic import PydanticBaseModel
from langchain_core.output_parsers import PydanticOutputParser


class RatingPoint(PydanticBaseModel):
    name: str = Field(description="Mês abreviado (ex: 'Jan', 'Fev')")
    rating: int = Field(description="Rating final do usuário naquele mês")

class WinRateStats(PydanticBaseModel):
    name: str = Field(description="Deve ser exatamente 'Partidas de Brancas' ou 'Partidas de Pretas'")
    vitorias: int = Field(description="Contagem de vitórias")
    derrotas: int = Field(description="Contagem de derrotas")
    empates: int = Field(description="Contagem de empates")

class OpeningStats(PydanticBaseModel):
    name: str = Field(description="Nome da abertura (ex: 'Defesa Siciliana')")
    value: int = Field(description="Quantidade de vezes jogada")

class KPIStats(PydanticBaseModel):
    winRate: str = Field(description="Taxa de vitória formatada (ex: '58%')")
    currentRating: int = Field(description="Rating atual do jogador")
    totalGames: int = Field(description="Total de partidas analisadas")

class DashboardData(PydanticBaseModel):
    kpis: KPIStats
    ratingData: List[RatingPoint] = Field(description="Histórico de rating mensal")
    winRateData: List[WinRateStats] = Field(description="Comparativo de performance por cor")
    openingsData: List[OpeningStats] = Field(description="Top aberturas mais jogadas")