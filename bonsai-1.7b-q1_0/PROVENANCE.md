# Bonsai-1.7B Q1_0 — provenance

| | |
|---|---|
| model | Bonsai-1.7B, 1-bit (ggml `Q1_0`), by prism-ml, built from Qwen3-1.7B (Alibaba Cloud) |
| source | [huggingface.co/prism-ml/Bonsai-1.7B-gguf](https://huggingface.co/prism-ml/Bonsai-1.7B-gguf) |
| revision | `210a9e99f79cb184909d49595906526eb2b3dd9a` |
| file | `Bonsai-1.7B-Q1_0.gguf`, 248,302,272 bytes |
| sha256 | `3d7c6c90dd98717a203adb22d5eacd2581850e40aa5327e144b97766cae5f7e3` |
| licence | Apache-2.0 ([LICENSE](LICENSE), [NOTICE.txt](NOTICE.txt)); *Created using Bonsai by Prism ML.* |
| card | [MODEL-CARD.md](MODEL-CARD.md): the source's README.md at that revision |

**How it was checked (2026-10-13).** The file was imported by bankML's importer (`sAGI/models.py`) on 2026-09-29,
which checked it against Hugging Face's published LFS sha256 and wrote the pin
([Bonsai-1.7B-Q1_0.gguf.FORK.json](Bonsai-1.7B-Q1_0.gguf.FORK.json)). Here, `verify.mjs --source` checks it again against
Hugging Face's own record at the pinned revision: the model's LFS sha256, and the Git blob ids of LICENSE, NOTICE.txt and
README.md — all identical. bankML refuses any file whose sha256 is not the pin, wherever it came from.
