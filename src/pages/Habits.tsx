import { useState } from 'react';
import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import Modal from '../components/ui/Modal';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';
import { DIFF_GOLD, DIFF_XP } from '../lib/gameLogic';
import type { Difficulty, Frequency, Habit } from '../types/game';

const FREQS: Frequency[] = ['daily','weekdays','weekends','3xweek','weekly'];
const DIFFS: Difficulty[] = ['easy','normal','hard'];

export default function Habits() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  const habits = useGameStore(s => s.habits);
  const categories = useGameStore(s => s.categories);
  const addHabit = useGameStore(s => s.addHabit);
  const updateHabit = useGameStore(s => s.updateHabit);
  const removeHabit = useGameStore(s => s.removeHabit);
  const addCategory = useGameStore(s => s.addCategory);

  const [openHabit, setOpenHabit] = useState<{ mode: 'add' | 'edit'; habit?: Habit } | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState(categories[0]?.id ?? '');
  const [diff, setDiff] = useState<Difficulty>('normal');
  const [freq, setFreq] = useState<Frequency>('daily');

  const [openCat, setOpenCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#00d9ff');

  function startAdd() {
    setTitle(''); setDesc(''); setCat(categories[0]?.id ?? '');
    setDiff('normal'); setFreq('daily');
    setOpenHabit({ mode: 'add' });
  }
  function startEdit(h: Habit) {
    setTitle(localizedTitle(h, lang));
    setDesc(h.description ?? '');
    setCat(h.category_id ?? '');
    setDiff(h.difficulty); setFreq(h.frequency);
    setOpenHabit({ mode: 'edit', habit: h });
  }
  function saveHabit() {
    if (!openHabit) return;
    if (openHabit.mode === 'add') {
      addHabit({
        title, description: desc, category_id: cat,
        difficulty: diff, frequency: freq,
        xp_reward: DIFF_XP[diff], gold_reward: DIFF_GOLD[diff]
      });
    } else if (openHabit.habit) {
      // при редактировании затираем title (включая язык, на котором отредачили)
      updateHabit(openHabit.habit.id, {
        title, description: desc, category_id: cat,
        difficulty: diff, frequency: freq,
        xp_reward: DIFF_XP[diff], gold_reward: DIFF_GOLD[diff],
        // если редактируем системную — синхронизируем нужный язык, чтобы не было залипшего перевода
        ...(lang === 'ru' ? { title_ru: title } : { title_en: title })
      });
    }
    setOpenHabit(null);
  }

  const sys = habits.filter(h => h.is_system);
  const own = habits.filter(h => !h.is_system);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-pixel text-lg text-cyan neon-text">{t('habits.title')}</h1>
        <div className="flex gap-2 flex-wrap">
          <PixelButton onClick={() => setOpenCat(true)}>+ {t('habits.catField')}</PixelButton>
          <PixelButton variant="primary" onClick={startAdd}>+ {t('habits.addNew')}</PixelButton>
        </div>
      </div>

      <PixelCard title={t('habits.yourHabits')} accent="magenta">
        {own.length === 0 && <div className="text-muted">{t('common.empty')}</div>}
        <HabitList habits={own} t={t} lang={lang} categories={categories}
          onEdit={startEdit} onDelete={removeHabit} />
      </PixelCard>

      <PixelCard title={t('habits.systemHabits')} accent="cyan">
        <HabitList habits={sys} t={t} lang={lang} categories={categories}
          onEdit={startEdit} onDelete={removeHabit} />
      </PixelCard>

      <Modal open={!!openHabit} onClose={() => setOpenHabit(null)}
        title={openHabit?.mode === 'edit' ? t('common.edit') : t('habits.addNew')}>
        <div className="space-y-3">
          <input className="pixel-input" placeholder={t('habits.titleField')} value={title} onChange={e => setTitle(e.target.value)} />
          <input className="pixel-input" placeholder={t('habits.descField')} value={desc} onChange={e => setDesc(e.target.value)} />
          <Select label={t('habits.catField')} value={cat} onChange={setCat}
            options={categories.map(c => ({ value: c.id, label: `${c.icon}  ${lang === 'en' ? c.name_en : c.name_ru}` }))} />
          <Select label={t('habits.diffField')} value={diff} onChange={(v) => setDiff(v as Difficulty)}
            options={DIFFS.map(d => ({ value: d, label: t(`difficulty.${d}`) }))} />
          <Select label={t('habits.freqField')} value={freq} onChange={(v) => setFreq(v as Frequency)}
            options={FREQS.map(f => ({ value: f, label: t(`frequency.${f}`) }))} />
          <PixelButton variant="primary" className="w-full" onClick={saveHabit} disabled={!title}>
            {t('common.save')}
          </PixelButton>
        </div>
      </Modal>

      <Modal open={openCat} onClose={() => setOpenCat(false)} title={t('habits.catField')}>
        <div className="space-y-3">
          <input className="pixel-input" placeholder="Имя / Name" value={catName} onChange={e => setCatName(e.target.value)} />
          <input className="pixel-input" placeholder="#color" value={catColor} onChange={e => setCatColor(e.target.value)} />
          <PixelButton variant="primary" className="w-full"
            onClick={() => {
              addCategory({ key: catName.toLowerCase().replace(/\s+/g, '-'), name_ru: catName, name_en: catName, color: catColor, icon: '*' });
              setCatName(''); setOpenCat(false);
            }}
            disabled={!catName}
          >{t('common.save')}</PixelButton>
        </div>
      </Modal>
    </div>
  );
}

function localizedTitle(h: Habit, lang: 'ru' | 'en'): string {
  if (lang === 'en' && h.title_en) return h.title_en;
  if (lang === 'ru' && h.title_ru) return h.title_ru;
  return h.title;
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="stat-label mb-1">{label}</div>
      <select className="pixel-input" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function HabitList({
  habits, onDelete, onEdit, t, lang, categories
}: {
  habits: Habit[];
  onDelete: (id: string) => void;
  onEdit: (h: Habit) => void;
  t: (k: string, v?: any) => string;
  lang: 'ru' | 'en';
  categories: { id: string; color: string; icon: string }[];
}) {
  if (habits.length === 0) return null;
  return (
    <ul className="divide-y divide-frame">
      {habits.map(h => {
        const c = categories.find(x => x.id === h.category_id);
        return (
          <li key={h.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="font-pixel text-sm flex items-center gap-2">
                <span style={{ color: c?.color }}>{c?.icon}</span>
                <span className="truncate">{localizedTitle(h, lang)}</span>
              </div>
              <div className="text-muted text-sm">
                {t('frequency.' + h.frequency)} · {t('difficulty.' + h.difficulty)} · +{h.xp_reward}xp / +{h.gold_reward}g
              </div>
            </div>
            <div className="flex gap-1">
              <button className="text-muted hover:text-cyan font-pixel text-[10px] px-1" onClick={() => onEdit(h)}>
                {t('common.edit')}
              </button>
              <button className="text-muted hover:text-bad font-pixel text-[10px] px-1" onClick={() => onDelete(h.id)}>
                {t('common.delete')}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
