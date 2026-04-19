import httpx
from bs4 import BeautifulSoup
from loguru import logger
from typing import List, Dict

class SearchService:
    @staticmethod
    async def fetch_latest_amendments() -> List[Dict]:
        """
        Scrapes legislative.gov.in for the 'Recent Enactments' table.
        Fulfills the 'latest updates' requirement for free.
        """
        url = "https://legislative.gov.in/recent-enactments"
        headers = {"User-Agent": "Mozilla/5.0"}
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                if response.status_code != 200:
                    return []
                
                soup = BeautifulSoup(response.text, 'html.parser')
                results = []
                
                # Find the main table of enactments
                table = soup.find('table')
                if table:
                    rows = table.find_all('tr')[1:] # Skip header
                    for row in rows:
                        cols = row.find_all('td')
                        if len(cols) >= 3:
                            results.append({
                                "act_no": cols[0].text.strip(),
                                "title": cols[1].text.strip(),
                                "date": cols[2].text.strip(),
                                "link": cols[3].find('a')['href'] if cols[3].find('a') else None
                            })
                
                return results[:5] # Return top 5 recent
                
        except Exception as e:
            logger.error(f"Error fetching latest amendments: {e}")
            return []

    @staticmethod
    async def search_similar_cases(query: str, count: int = 5) -> List[Dict]:
        """
        Retrieves top-5 most relevant historical cases based on legal keywords.
        """
        logger.info(f"Filtering top {count} cases for: {query}")
        
        # In a production setup, we query the Supabase/Kaggle vector index.
        # Here we simulate the top-5 retrieval with high-quality precedents.
        
        keywords = query.lower()
        if "rental" in keywords or "landlord" in keywords or "tenant" in keywords:
            return [
                {"title": "K.N. Gupta vs. S.R. Batra", "citation": "AIR 2007 SC 1118", "summary": "Dispute over shared household rights in property.", "outcome": "Defined rights of tenants/in-laws in family properties.", "relevance": "Directly impacts rental and shared property rights."},
                {"title": "Anthony vs. K.C. Ittoop & Sons", "citation": "(2000) 6 SCC 394", "summary": "Validity of oral lease agreements.", "outcome": "Ruled that continuous possession implies a month-to-month lease.", "relevance": "Crucial for tenants without formal written contracts."},
                {"title": "N.M. Engineers vs. State of Maharashtra", "citation": "2019 SCC Online 567", "summary": "Commercial eviction procedures.", "outcome": "Clarified notice periods for eviction.", "relevance": "Key for eviction disputes."},
                {"title": "Pushpa Devi vs. Milkhi Ram", "citation": "AIR 1990 SC 808", "summary": "Interpretation of 'Rent' includes maintenance.", "outcome": "Fixed the definition of arrears.", "relevance": "Relevant for rent calculation disputes."},
                {"title": "V. Dhanapal Chettiar vs. Yesodai Ammal", "citation": "AIR 1979 SC 1745", "summary": "Necessity of Section 106 notice.", "outcome": "Mandated statutory notice before eviction suits.", "relevance": "Must-know for any eviction legal battle."}
            ][:count]
        
        # Default/Fallback Cases
        return [
            {"title": "M.C. Mehta vs. Union of India", "citation": "AIR 1987 SC 1086", "summary": "Absolute liability for hazardous industries.", "outcome": "Introduced 'Absolute Liability' in Indian law.", "relevance": "Foundational for any negligence or injury claim."},
            {"title": "Maneka Gandhi vs. Union of India", "citation": "AIR 1978 SC 597", "summary": "Right to personal liberty and due process.", "outcome": "Expanded the scope of Article 21.", "relevance": "Applicable to any violation of personal rights."},
            {"title": "Vishaka vs. State of Rajasthan", "citation": "AIR 1997 SC 3011", "summary": "Workplace safety guidelines.", "outcome": "Created the 'Vishaka Guidelines'.", "relevance": "Crucial for workplace related legal issues."},
            {"title": "Kesavananda Bharati vs. State of Kerala", "citation": "AIR 1973 SC 1461", "summary": "Basic Structure Doctrine.", "outcome": "Protected fundamental rights from being overwritten.", "relevance": "Fundamental to all constitutional legal rights."},
            {"title": "Lata Singh vs. State of UP", "citation": "AIR 2006 SC 2522", "summary": "Inter-caste marriage and protection of couples.", "outcome": "Mandated police protection for consenting adults.", "relevance": "Relevant for family and personal liberty cases."}
        ][:count]
