package services

import (
	"testing"

	"github.com/amatsi/backend/internal/repository"
)

// TestAdminServiceConstructor verifies wiring so a future change that breaks
// the constructor signature is caught without a live database.
func TestAdminServiceConstructor(t *testing.T) {
	svc := NewAdminService(repository.NewUserRepository(nil))
	if svc == nil {
		t.Fatal("NewAdminService() = nil")
	}
	if svc.userRepo == nil {
		t.Error("NewAdminService() did not set userRepo")
	}
}

// TestAdminErrorsDocumented ensures the sentinel errors the handler depends on
// are present, so a typo in error wiring is caught at compile/review time.
func TestAdminErrorsDocumented(t *testing.T) {
	if ErrAdminRequired == nil {
		t.Fatal("ErrAdminRequired must be a non-nil sentinel")
	}
}