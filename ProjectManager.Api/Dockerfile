# Stage 1: Build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all code
COPY . .

# Publish just the ProjectManager.Api
RUN dotnet publish "ProjectManager.Api/ProjectManager.Api.csproj" -c Release -o /app/publish

# Stage 2: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProjectManager.Api.dll"]