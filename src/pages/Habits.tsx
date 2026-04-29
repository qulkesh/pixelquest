import { useState } from 'react';
import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import Modal from '../components/ui/Modal';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { DIFF_GOLD, DIFF_XP } from '../lib/gameLogic';
import type { Difficulty, Frequency } from '../types/game';

const FREQS: Frequency[] = ['daily','weekdays','weekends','3xweek','weekly'];
const DIFFS: Difficulty[] = ['easy','normal','hard'];

export default function Habits() {
  const t = useT();
  const habits = useGameStore(s => s.habits);
  const categories = useGameStore(s => s.categories);
  const addHabit = useGameStore(s => s.addHabit);
  const removeHabit = useGameStore(s => s.removeHabit);
  const addCategory = useGameStore(s => s.addCategory);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState(categories[0]?.id ?? '');
  const [diff, setDiff] = useState<Difficulty>('normal');
  const [freq, setFreq] = useState<Frequency>('daily');

  const [openCat, setOpenCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#00d9ff');

  function save() {
    addHabit({
      title, description: desc, category_id: cat,
      difficulty: diff, frequency: freq,
      xp_reward: DIFF_XP[diff], gold_reward: DIFF_GOLD[diff]
    });
    setTitle(''); setDesc(''); setOpen(false);
  }

  const sys = habits.filter(h => h.is_system);
  const own = habits.filter(h => !h.is_system);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-lg text-cyan neon-text">{t('habits.title')}</h1>
        <div className="flex gap-2">
          <PixelButton onClick={() => setOpenCat(true)}>+ {t('habits.catField')}</PixelButton>
          <PixelButton variant="primary" onClick={() => setOpen(true)}>+ {t('habits.addNew')}</PixelButton>
        </div>
      </div>

      <PixelCard title={t('habits.yourHabits')} accent="magenta">
        {own.length === 0 && <div className="text-muted">{t('common.empty')}</div>}
        <HabitList habits={own} onDelete={removeHabit} t={t} categories={categories} />
      </PixelCard>

      <PixelCard title={t('habits.systemHabits')} accent="cyan">
        <HabitList habits={sys} t={t} categories={categories} />
      </PixelCard>

      <Modal open={open} onClose={() => setOpen(false)} title={t('habits.addNew')}>
        <div className="space-y-3">
          <input className="pixel-input" placeholder={t('habits.titleField')} value={title} onChange={e => setTitle(e.target.value)} />
          <input className="pixel-input" placeholder={t('habits.descField')} value={desc} onChange={e => setDesc(e.target.value)} />
          <Select label={t('habits.catField')} value={cat} onChange={setCat}
            options={categories.map(c => ({ value: c.id, label: `${c.icon}  ${c.name_ru}` }))} />
          <Select label={t('habits.diffField')} value={diff} onChange={(v) => setDiff(v as Difficulty)}
            options={DIFFS.map(d => ({ value: d, label: t(`difficulty.${d}`) }))} />
          <Select label={t('habits.freqField')} value={freq} onChange={(v) => setFreq(v as Frequency)}
            options={FREQS.map(f => ({ value: f, label: t(`frequency.${f}`) }))} />
          <PixelButton variant="primary" className="w-full" onClick={save} disabled={!title}>
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

function HabitList({ habits, onDelete, t, categories }: any) {
  return (
    <ul className="divide-y divide-frame">
      {habits.map((h: any) => {
        const c = categories.find((x: any) => x.id === h.category_id);
        return (
          <li key={h.id} className="py-2 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-pixel text-sm flex items-center gap-2">
                <span style={{ color: c?.color }}>{c?.icon}</span>
                <span className="truncate">{h.title}</span>
              </div>
              <div className="text-muted text-sm">
                {t('frequency.' + h.frequency)} · {t('difficulty.' + h.difficulty)} · +{h.xp_reward}xp / +{h.gold_reward}g
              </div>
            </div>
            {onDelete && (
              <button className="text-muted hover:text-bad font-pixel text-[10px]" onClick={() => onDelete(h.id)}>
                {t('common.delete')}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
