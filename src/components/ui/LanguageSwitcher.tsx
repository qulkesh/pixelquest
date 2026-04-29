import { useUiStore } from '../../store/useUiStore';

export default function LanguageSwitcher() {
  const lang = useUiStore(s => s.lang);
  const setLang = useUiStore(s => s.setLang);
  return (
    <div className="inline-flex border-2 border-frame">
      {(['ru', 'en'] as const).map(l => (
        <button
          key={l}
          className={`px-2 py-1 font-pixel text-[10px] uppercase ${lang === l ? 'bg-cyan text-bg' : 'text-muted hover:text-ink'}`}
          onClick={() => setLang(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
