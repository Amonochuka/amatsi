package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

// RecommendationHandler serves the /api/recommendations routes.
type RecommendationHandler struct {
	farmRepo *repository.FarmRepository
	recRepo  *repository.RecommendationRepository
	svc      *services.RecommendationService
}

func NewRecommendationHandler(
	farmRepo *repository.FarmRepository,
	recRepo *repository.RecommendationRepository,
	svc *services.RecommendationService,
) *RecommendationHandler {
	return &RecommendationHandler{
		farmRepo: farmRepo,
		recRepo:  recRepo,
		svc:      svc,
	}
}

func (h *RecommendationHandler) GetRecommendations(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	farm, err := h.farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	recs, err := h.recRepo.GetRecommendationsByFarm(c.Request.Context(), farmID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if recs == nil {
		recs = []*models.Recommendation{}
	}
	c.JSON(http.StatusOK, recs)
}

func (h *RecommendationHandler) Generate(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		FarmID string `json:"farm_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	farm, err := h.farmRepo.GetFarmByID(c.Request.Context(), input.FarmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	rec, err := h.svc.GenerateRecommendation(c.Request.Context(), input.FarmID)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "recommendation upstream unavailable"})
		return
	}
	c.JSON(http.StatusOK, rec)
}