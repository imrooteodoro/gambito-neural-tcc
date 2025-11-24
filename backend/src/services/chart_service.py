from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.language_models import BaseChatModel

from src.services.game_history_service import GameHistoryService
from src.schemas.chart import DashboardData 

class ChartService:
    def __init__(self, game_history_service: GameHistoryService, llm: BaseChatModel):
        self.data_service = game_history_service 
        self.llm = llm
        self.parser = PydanticOutputParser(pydantic_object=DashboardData)

    def generate_chart_data(self, user_id: int) -> dict:
        studies = self.data_service.get_studies_by_user(user_id)
        
        if not studies:
            return self._get_empty_structure()

      
        data_str = "\n".join([
            f"- Data: {s.created_at}, PGN/Dados: {s.study_data}" 
            for s in studies
        ])

        prompt = PromptTemplate(
            template="""
            Aja como uma engine de análise de dados para um dashboard de Xadrez.
            Analise os dados brutos de estudos abaixo e gere um JSON estrito.
            
            DADOS DOS ESTUDOS:
            {data}

            REGRAS:
            - ratingData: Estime a evolução baseada nos metadados do PGN se houver, ou datas.
            - winRateData: Tente extrair vitórias/derrotas do texto do PGN.
            - openingsData: Identifique aberturas no texto PGN.
            
            {format_instructions}
            """,
            input_variables=["data"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        chain = prompt | self.llm | self.parser
        
        try:
            result = chain.invoke({"data": data_str})
            return result.dict()
        except Exception as e:
            print(f"Erro na geração do gráfico: {e}")
            raise e

    def _get_empty_structure(self):
        return {
            "kpis": {"winRate": "0%", "currentRating": 0, "totalGames": 0},
            "ratingData": [],
            "winRateData": [],
            "openingsData": []
        }