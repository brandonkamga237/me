"""Domain and application code stay framework-free, so the business rules outlive the frameworks."""

import ast
from pathlib import Path

import pytest

APP = Path(__file__).resolve().parent.parent / "app"
FORBIDDEN = {"fastapi", "starlette", "pydantic", "pydantic_settings", "pymongo", "bson", "jwt", "pwdlib"}
CORE_FILES = sorted([*APP.glob("*/domain.py"), *APP.glob("*/application.py")])


def imported_roots(path: Path) -> set[str]:
    roots: set[str] = set()
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Import):
            roots.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            roots.add(node.module.split(".")[0])
    return roots


@pytest.mark.parametrize("path", CORE_FILES, ids=lambda p: str(p.relative_to(APP)))
def test_core_code_imports_no_framework(path: Path) -> None:
    assert imported_roots(path) & FORBIDDEN == set()


def test_core_files_were_found() -> None:
    assert len(CORE_FILES) >= 12
