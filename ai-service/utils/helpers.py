"""Small unit-conversion helpers for farm area inputs."""

ACRE_IN_SQUARE_METRES = 4046.86
HECTARE_IN_SQUARE_METRES = 10_000.0


def acres_to_square_metres(acres: float) -> float:
    return acres * ACRE_IN_SQUARE_METRES


def hectares_to_square_metres(hectares: float) -> float:
    return hectares * HECTARE_IN_SQUARE_METRES


def normalize_field_size(size: float, unit: str) -> float:
    normalized_unit = unit.strip().lower()
    if normalized_unit in {"m2", "sqm", "square_metres", "square_meters"}:
        return size
    if normalized_unit in {"acre", "acres"}:
        return acres_to_square_metres(size)
    if normalized_unit in {"ha", "hectare", "hectares"}:
        return hectares_to_square_metres(size)
    raise ValueError(f"Unsupported field-size unit: {unit}")
