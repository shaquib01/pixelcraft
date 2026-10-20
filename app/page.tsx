"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, ImagePlus, Sparkles, Type, WandSparkles, X } from "lucide-react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("Make it yours.");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(42);
  const [prompt, setPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => { imageRef.current = img; drawCanvas(); };
    img.src = imageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, text, textColor, fontSize]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = Math.min(1, 1400 / img.width);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (text.trim()) {
      const size = Math.max(12, fontSize * scale);
      ctx.font = `600 ${size}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, size / 12);
      ctx.strokeStyle = "rgba(0,0,0,.38)";
      ctx.fillStyle = textColor;
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2, canvas.width * .88);
      ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width * .88);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setAiMessage("Please choose an image file."); return; }
    if (file.size > 15 * 1024 * 1024) { setAiMessage("Please choose an image smaller than 15 MB."); return; }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFileName(file.name);
    setAiMessage("");
  }

  function downloadImage() {
    if (!imageRef.current || !canvasRef.current) return;
    drawCanvas();
    const link = document.createElement("a");
    link.download = "pixelcraft-creation.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  async function requestAiEdit() {
    if (!imageUrl) { setAiMessage("Upload an image first, then describe your edit."); return; }
    if (!prompt.trim()) { setAiMessage("Write a prompt describing the change you want."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const result = await response.json();
      setAiMessage(result.error || "AI editing is not connected yet.");
    } catch {
      setAiMessage("Could not reach the editing service. Try again later.");
    } finally { setBusy(false); }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark"><Sparkles size={19} /></span><span>pixelcraft<span className="brand-dot">.</span></span></a>
        <nav className="top-links"><a href="#editor">Studio</a><a href="#how">How it works</a><span className="beta-pill">EARLY ACCESS</span></nav>
        <button className="top-cta" onClick={() => inputRef.current?.click()}>Start creating <ArrowUpRight size={16}/></button>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="pulse-dot" /> YOUR LITTLE CREATIVE STUDIO</div>
        <h1>Ideas in. <span>Magic out.</span></h1>
        <p className="hero-copy">A fresh canvas for your imagination. Bring your images, add a little personality, and make something that feels like you.</p>
        <div className="hero-points"><span><Check size={15}/> Simple tools</span><span><Check size={15}/> Your image stays in your browser</span><span><Check size={15}/> Export in PNG</span></div>
      </section>

      <section className="workspace" id="editor">
        <aside className="tools-panel">
          <div className="panel-heading"><div><span className="section-kicker">THE WORKSPACE</span><h2>Make it yours</h2></div><span className="step-badge">01 / 02</span></div>
          <div className="tool-section">
            <div className="tool-title"><span className="tool-icon"><ImagePlus size={17}/></span><div><strong>Your image</strong><small>Start with a photo or graphic</small></div></div>
            <button className="upload-button" onClick={() => inputRef.current?.click()}><ImagePlus size={18}/><span>{fileName ? "Choose another image" : "Upload an image"}</span><span className="upload-shortcut">JPG · PNG · WEBP</span></button>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
            {fileName && <div className="file-chip"><span className="file-mini"><ImagePlus size={14}/></span><span className="file-name">{fileName}</span><button aria-label="Remove image" onClick={() => { setImageUrl(""); setFileName(""); imageRef.current = null; }}><X size={15}/></button></div>}
          </div>
          <div className="tool-section">
            <div className="tool-title"><span className="tool-icon"><Type size={17}/></span><div><strong>Add a little text</strong><small>A caption, a title, a feeling</small></div></div>
            <label className="field-label" htmlFor="overlay-text">YOUR WORDS</label>
            <input id="overlay-text" className="text-input" value={text} onChange={e => setText(e.target.value)} placeholder="Type something lovely..." maxLength={120}/>
            <div className="range-head"><label className="field-label" htmlFor="font-size">TEXT SIZE</label><span>{fontSize}px</span></div>
            <input id="font-size" className="range-input" type="range" min="18" max="76" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}/>
            <div className="color-row"><label className="field-label" htmlFor="text-color">TEXT COLOUR</label><div className="color-control"><input id="text-color" type="color" value={textColor} onChange={e => setTextColor(e.target.value)}/><span>{textColor.toUpperCase()}</span></div></div>
          </div>
          <div className="tool-section ai-section">
            <div className="tool-title"><span className="tool-icon ai-icon"><WandSparkles size={17}/></span><div><strong>Dream it with AI</strong><small>Describe the change you imagine</small></div><span className="soon-tag">BETA</span></div>
            <textarea className="prompt-input" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Make the sky dreamy and pink..." rows={3}/>
            <button className="ai-button" onClick={requestAiEdit} disabled={busy}>{busy ? "Checking connection…" : "Try AI edit"} <Sparkles size={16}/></button>
            {aiMessage && <p className="ai-message" role="status">{aiMessage}</p>}
          </div>
          <div className="panel-footer"><span className="secure-dot"/> Your original stays untouched</div>
        </aside>

        <div className="canvas-panel">
          <div className="canvas-toolbar"><div className="canvas-title"><span className="live-dot"/><strong>Live preview</strong><span className="preview-label">CHANGES AS YOU GO</span></div><button className="download-button" onClick={downloadImage} disabled={!imageUrl}><ArrowDownToLine size={16}/> Export PNG</button></div>
          <div className="canvas-stage">
            {imageUrl ? <canvas ref={canvasRef} className="preview-canvas" /> : <div className="empty-state"><div className="empty-art"><div className="art-sun"/><div className="art-hill hill-one"/><div className="art-hill hill-two"/><span className="art-star star-one">✳</span><span className="art-star star-two">✦</span><div className="art-frame"><ImagePlus size={25}/></div></div><h3>Your next masterpiece starts here.</h3><p>Upload an image to see your canvas come to life.</p><button className="empty-upload" onClick={() => inputRef.current?.click()}>Choose an image <ArrowUpRight size={16}/></button><span className="drop-note">A little creativity goes a long way.</span></div>}
          </div>
          <div className="canvas-bottom"><span><span className="status-dot"/> {imageUrl ? "Canvas ready" : "Waiting for your first image"}</span><span>MADE WITH A LITTLE PIXEL MAGIC ✳</span></div>
        </div>
      </section>

      <section className="how-section" id="how"><div className="how-intro"><span className="section-kicker">NO BIG LEARNING CURVE</span><h2>Creativity, without the complicated.</h2></div><div className="how-grid"><article><span className="how-number">01</span><h3>Bring your image</h3><p>Start with a photo, a product shot, or anything you want to make your own.</p></article><article><span className="how-number">02</span><h3>Add your touch</h3><p>Give it a caption and adjust the style until it feels just right.</p></article><article><span className="how-number">03</span><h3>Take it with you</h3><p>Export your creation as a PNG and share it wherever inspiration takes you.</p></article></div></section>
      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark"><Sparkles size={16}/></span><span>pixelcraft<span className="brand-dot">.</span></span></a><span>A tiny studio for big ideas.</span><span>© 2026 PixelCraft</span></footer>
    </main>
  );
}