.PHONY: help build up down logs restart clean dev prod

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo '$(GREEN)Available commands:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build production Docker images
	@echo "$(GREEN)Building production images...$(NC)"
	docker-compose build

up: ## Start production services
	@echo "$(GREEN)Starting production services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started! Access at http://localhost:3000$(NC)"

down: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker-compose restart

clean: ## Remove all containers, volumes and images
	@echo "$(YELLOW)Cleaning up Docker resources...$(NC)"
	docker-compose down -v --rmi all

dev: ## Start development environment with hot reload
	@echo "$(GREEN)Starting development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up

dev-build: ## Build and start development environment
	@echo "$(GREEN)Building development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up --build

prod: build up ## Build and start production environment

ps: ## Show running containers
	docker-compose ps

shell: ## Access web container shell
	docker-compose exec web sh

db-shell: ## Access PostgreSQL shell
	docker-compose exec db psql -U postgres -d codeguy

stats: ## Show resource usage
	docker stats

rebuild: ## Rebuild without cache
	@echo "$(GREEN)Rebuilding without cache...$(NC)"
	docker-compose build --no-cache
