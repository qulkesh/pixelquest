import { useState } from 'react';
import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import Modal from '../components/ui/Modal';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import type { Difficulty } from '../types/game';
import { DIFF_GOLD, DIFF_XP } from '../lib/gameLogic';

export default function Todos() {
  const t = useT();
  const tasks = useGameStore(s => s.tasks);
  const categories = useGameStore(s => s.categories);
  const addTask = useGameStore(s => s.addTask);
  const completeTask = useGameStore(s => s.completeTask);
  const failTask = useGameStore(s => s.failTask);
  const restoreTask = useGameStore(s => s.restoreTask);
  const removeTask = useGameStore(s => s.removeTask);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [diff, setDiff] = useState<Difficulty>('normal');
  const [cat, setCat] = useState(categories[0]?.id ?? '');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState<'todo' | 'goal'>('todo');

  function save() {
    addTask({
      title, description: desc,
      deadline: deadline || null,
      difficulty: diff, category_id: cat,
      type,
      xp_reward: DIFF_XP[diff], gold_reward: DIFF_GOLD[diff]
    });
    setTitle(''); setDesc(''); setDeadline(''); setOpen(false);
  }

  const active = tasks.filter(t => t.status === 'active');
  const done = tasks.filter(t => t.status === 'completed');
  const failed = tasks.filter(t => t.status === 'failed');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-lg text-cyan neon-text">{t('todos.title')}</h1>
        <PixelButton variant="primary" onClick={() => setOpen(true)}>+ {t('todos.addNew')}</PixelButton>
      </div>

      <PixelCard title="Active" accent="cyan">
        {active.length === 0 && <div className="text-muted">{t('todos.none')}</div>}
        <ul className="divide-y divide-frame">
          {active.map(task => {
            const c = categories.find(x => x.id === task.category_id);
            const overdue = task.deadline && new Date(task.deadline) < new Date();
            return (
              <li key={task.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-pixel text-sm flex items-center gap-2">
                    <span style={{ color: c?.color }}>{c?.icon}</span>
                    <span className="truncate">{task.title}</span>
                    {task.type === 'goal' && <span className="text-magenta font-pixel text-[9px]">[GOAL]</span>}
                  </div>
                  <div className="text-muted text-sm">
                    {task.description && <span>{task.description} · </span>}
                    {t('difficulty.' + task.difficulty)} · +{task.xp_reward}xp / +{task.gold_reward}g
                    {task.deadline && <span className={overdue ? 'text-bad ml-2' : 'text-muted ml-2'}>{overdue ? t('todos.overdue') + ': ' : t('todos.deadline') + ': '}{new Date(task.deadline).toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <PixelButton variant="good" onClick={() => completeTask(task.id)}>{t('todos.complete')}</PixelButton>
                  <PixelButton variant="bad" onClick={() => failTask(task.id)}>{t('todos.failNow')}</PixelButton>
                  <PixelButton variant="ghost" onClick={() => removeTask(task.id)}>×</PixelButton>
                </div>
              </li>
            );
          })}
        </ul>
      </PixelCard>

      {done.length > 0 && (
        <PixelCard title="Done" accent="good">
          <ul className="divide-y divide-frame">
            {done.map(task => (
              <li key={task.id} className="py-2 flex items-center justify-between">
                <span className="line-through text-muted">{task.title}</span>
                <PixelButton variant="ghost" onClick={() => restoreTask(task.id)}>{t('todos.restore')}</PixelButton>
              </li>
            ))}
          </ul>
        </PixelCard>
      )}

      {failed.length > 0 && (
        <PixelCard title="Failed" accent="bad">
          <ul className="divide-y divide-frame">
            {failed.map(task => (
              <li key={task.id} className="py-2 flex items-center justify-between">
                <span className="text-bad">{task.title}</span>
                <PixelButton variant="ghost" onClick={() => restoreTask(task.id)}>{t('todos.restore')}</PixelButton>
              </li>
            ))}
          </ul>
        </PixelCard>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={t('todos.addNew')}>
        <div className="space-y-3">
          <input className="pixel-input" placeholder={t('habits.titleField')} value={title} onChange={e => setTitle(e.target.value)} />
          <input className="pixel-input" placeholder={t('habits.descField')} value={desc} onChange={e => setDesc(e.target.value)} />
          <input className="pixel-input" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <select className="pixel-input" value={cat} onChange={e => setCat(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name_ru}</option>)}
          </select>
          <select className="pixel-input" value={diff} onChange={e => setDiff(e.target.value as Difficulty)}>
            {(['easy','normal','hard'] as Difficulty[]).map(d => <option key={d} value={d}>{t(`difficulty.${d}`)}</option>)}
          </select>
          <select className="pixel-input" value={type} onChange={e => setType(e.target.value as any)}>
            <option value="todo">to-do</option>
            <option value="goal">goal</option>
          </select>
          <PixelButton variant="primary" className="w-full" disabled={!title} onClick={save}>{t('common.save')}</PixelButton>
        </div>
      </Modal>
    </div>
  );
}
