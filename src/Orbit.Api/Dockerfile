FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Orbit.Api/Orbit.Api.csproj", "src/Orbit.Api/"]
COPY ["src/Orbit.Core/Orbit.Core.csproj", "src/Orbit.Core/"]
COPY ["src/Orbit.Application/Orbit.Application.csproj", "src/Orbit.Application/"]
COPY ["src/Orbit.Infrastructure/Orbit.Infrastructure.csproj", "src/Orbit.Infrastructure/"]
RUN dotnet restore "src/Orbit.Api/Orbit.Api.csproj"
COPY . .
WORKDIR "/src/src/Orbit.Api"
RUN dotnet build "./Orbit.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Orbit.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Orbit.Api.dll"]
