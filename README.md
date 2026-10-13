<div align="center">

<img src="logo.png" width="160" alt="browseML">

### browseML's models — a verified copy, a second source

</div>

The models browseML runs, byte for byte, with what proves them. This repository is the **second verified source**
beside Hugging Face: browseML can pull a model from either, and the same sha256 pin decides — a file that does not match
is refused, wherever it came from. More sources (peer to peer, IPFS by content address) join the same way.

<table>
<tr>
<td width="33%" valign="top">

**The same bytes**

Each model is the source's own file at a pinned revision (Git LFS), with its licence, notice and card.

</td>
<td width="33%" valign="top">

**Checked three ways**

Against `SHA256SUMS`, against its pin (the `FORK.json` bankML answers from), and against the source's own published hashes.

</td>
<td width="33%" valign="top">

**Anyone can check**

`./verify.sh` with the tools every system has, or `node verify.mjs --source` with no dependencies.

</td>
</tr>
</table>

## Models

| model | size | sha256 | source | licence |
|---|---|---|---|---|
| [Bonsai-1.7B Q1_0](bonsai-1.7b-q1_0/PROVENANCE.md) | 248 MB | `3d7c6c90dd98717a…` | [prism-ml/Bonsai-1.7B-gguf](https://huggingface.co/prism-ml/Bonsai-1.7B-gguf) @ `210a9e99` | Apache-2.0 |

## Verify

```sh
git clone https://github.com/browseML/models && cd models    # Git LFS pulls the model (248 MB)
./verify.sh                  # every file against SHA256SUMS
node verify.mjs --source     # and every model against its pin and its source's published hashes
```

## Used by

- [browseML](https://github.com/browseML/browseML) — machine learning in your browser: pulls the model from Hugging
  Face or from here, checks it against the pin, then answers with a receipt.
- [bankML](https://github.com/cryptoAGI/bankml) — the engine: `bankml verify`, and `serve` refuses an unpinned file.

Scripts: `MIT OR Apache-2.0`. Models: their own licences (see each folder). *Created using Bonsai by Prism ML.*
