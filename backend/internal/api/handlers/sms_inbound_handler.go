package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/services"
)

// SMSInboundHandler is the public webhook Africa's Talking calls when a
// recipient replies to an SMS (inbound / mobile-originated message). Replies
// of STOP disable SMS alerts for that number; START re-enables them.
//
// The callback payload is sent as POST form data (or GET query parameters)
// with fields including "from" (the replying number) and "text". It sits
// outside the JWT-authenticated API group because Africa's Talking cannot
// present our token.
type SMSInboundHandler struct {
	optoutSvc *services.OptOutService
}

func NewSMSInboundHandler(optoutSvc *services.OptOutService) *SMSInboundHandler {
	return &SMSInboundHandler{optoutSvc: optoutSvc}
}

func (h *SMSInboundHandler) Inbound(c *gin.Context) {
	from := c.PostForm("from")
	if from == "" {
		from = c.Query("from")
	}
	text := c.PostForm("text")
	if text == "" {
		text = c.Query("text")
	}

	if strings.TrimSpace(from) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing 'from' parameter"})
		return
	}

	result := h.optoutSvc.HandleInbound(c.Request.Context(), from, text)

	status := "ignored"
	if result.Action != "" {
		status = "ok"
	}
	c.JSON(http.StatusOK, gin.H{"status": status, "result": result})
}