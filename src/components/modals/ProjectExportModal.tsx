import React, { useState } from 'react';
import {
  X,
  Download,
  FolderTree,
  Terminal,
  CheckCircle2,
  FileCode,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Cloud,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface ProjectExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExportModal: React.FC<ProjectExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = () => {
    setDownloadingZip(true);
    // Direct download of the real generated project ZIP from public/
    const link = document.createElement('a');
    link.href = '/telai-android-project.zip';
    link.download = 'telai-android-project.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      setDownloadingZip(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-xl bg-[#0A0E1A] border border-indigo-900/80 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[92vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-950/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">
                Mobile-Accessible APK Generation
              </h2>
              <p className="text-[11px] text-cyan-400 font-mono">
                No PC, Mac Terminal, or local Android Studio needed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Main 1-Tap Download Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121B32] to-[#0E1528] border-2 border-indigo-600/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  Step 1: Download Complete Package
                </span>
                <h3 className="text-sm font-bold text-slate-100">TelAI Android Project ZIP</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/40">
                109 KB · Complete
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Includes the complete native Android codebase (Kotlin, Jetpack Compose, TDLib client, Room DB, Keystore), the Gradle wrapper binaries (<code className="text-cyan-300">gradle-wrapper.jar</code>), and the pre-configured GitHub Actions cloud compiler.
            </p>

            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-500 hover:opacity-95 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingZip ? 'Preparing Download...' : 'Download Project ZIP to Phone'}</span>
            </button>

            {downloadSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded `telai-android-project.zip` to phone!</span>
              </div>
            )}
          </div>

          {/* Step 2: 3-Minute Free Cloud APK Compilation Workflow */}
          <div className="p-3.5 rounded-2xl bg-[#070A12] border border-indigo-950/80 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Cloud className="w-4 h-4" />
                <span>Mobile Phone APK Build Workflow</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">100% Free Cloud Build</span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="p-2 rounded-xl bg-[#080C16] border border-slate-900 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">1</span>
                  <span>Create a GitHub Repository on Mobile:</span>
                </div>
                <p className="text-slate-400 pl-5">
                  Open <span className="text-cyan-300 font-mono">github.new</span> in your phone's browser and create a free private/public repo (e.g. <code>telai-agent</code>).
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#080C16] border border-slate-900 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">2</span>
                  <span>Upload the Downloaded ZIP:</span>
                </div>
                <p className="text-slate-400 pl-5">
                  Tap <em>Upload files</em> in GitHub mobile web and select the downloaded <code>telai-android-project.zip</code> (or push with Git/Termux).
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#080C16] border border-slate-900 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">3</span>
                  <span>Automatic APK Generation:</span>
                </div>
                <p className="text-slate-400 pl-5">
                  The included <code className="text-cyan-300">.github/workflows/build-apk.yml</code> automatically triggers! GitHub's cloud servers compile <code className="text-white">./gradlew assembleDebug</code> using pre-installed JDK 17 & Android SDK 35.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#080C16] border border-slate-900 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">4</span>
                  <span>Download APK to Phone:</span>
                </div>
                <p className="text-slate-400 pl-5">
                  Go to <strong>Actions</strong> or <strong>Releases</strong> on your mobile browser, tap <span className="text-emerald-400 font-mono font-bold">app-debug.apk</span>, and Android installs it directly!
                </p>
              </div>
            </div>
          </div>

          {/* Missing Secrets or Configuration Notice */}
          <div className="p-3.5 rounded-2xl bg-[#0E1528] border border-amber-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <KeyRound className="w-4 h-4" />
              <span>Configuration / Secrets You Supply</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              No secrets are hardcoded in the codebase for your security. You can either place them in <code>android/local.properties</code> or configure them inside the app on your phone:
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1 font-mono">
              <li><strong className="text-slate-200">telegram.api_id</strong> &amp; <strong className="text-slate-200">telegram.api_hash</strong> (from my.telegram.org)</li>
              <li><strong className="text-slate-200">gemini.api_key</strong> (from aistudio.google.com, entered in Settings &gt; AI Models)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-indigo-950/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            TelAI v1.0.0 Native Android
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
