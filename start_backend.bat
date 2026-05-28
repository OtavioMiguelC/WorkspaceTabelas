@echo off
echo ===========================================
echo INICIANDO O BACKEND PYTHON DA CONSOLIDA
echo ===========================================

echo.
echo 1. Instalando dependencias do Python (se necessario)...
pip install -r api/requirements.txt

echo.
echo 2. Iniciando Servidor da API (FastAPI) na porta 8000...
echo.
uvicorn api.index:app --reload --port 8000
pause
