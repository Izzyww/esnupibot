SET "DIST_FOLDER=dist"

IF NOT EXIST "%DIST_FOLDER%" (
    ECHO Pasta %DIST_FOLDER% não encontrada. Compilando projeto...

    CALL npm run build

    ECHO Projeto compilado com sucesso.
) ELSE (
    ECHO Pasta %DIST_FOLDER% já existe. Iniciando o bot...
)

CALL npm run start
ECHO Bot iniciado e rodando.