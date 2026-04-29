import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import ItemSprite from '../components/ItemSprite';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';
import type { ItemSlot } from '../types/game';

const ORDER: ItemSlot[] = ['weapon','armor','helmet','boots','amulet','book','gadget','tool','potion','chest','booster','cosmetic','background'];

export default function Inventory() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  const inv = useGameStore(s => s.inventory);
  const items = useGameStore(s => s.items);
  const equip = useGameStore(s => s.equipItem);
  const unequip = useGameStore(s => s.unequipItem);
  const usePotion = useGameStore(s => s.usePotion);
  const openChest = useGameStore(s => s.openChest);

  const groups: Record<string, typeof inv> = {};
  for (const r of inv) {
    const it = items.find(i => i.id === r.item_id); if (!it) continue;
    (groups[it.slot] ||= []).push(r);
  }

  if (inv.length === 0) {
    return <div className="text-muted">{t('inventory.empty')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-lg text-cyan neon-text">{t('inventory.title')}</h1>
      {ORDER.map(slot => {
        const list = groups[slot]; if (!list?.length) return null;
        return (
          <PixelCard key={slot} title={t('slot.' + slot)} accent="cyan">
            <div className="grid md:grid-cols-3 gap-3">
              {list.map(r => {
                const it = items.find(i => i.id === r.item_id)!;
                const name = lang === 'en' ? it.name_en : it.name_ru;
                return (
                  <div key={r.id} className="pixel-frame-soft p-3 flex gap-3 items-start">
                    <ItemSprite item={it} size={56} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-pixel text-sm rarity-${it.rarity}`}>
                        {name}
                        {r.quantity > 1 && <span className="ml-2 text-muted">{t('inventory.quantity', { n: r.quantity })}</span>}
                        {r.equipped && <span className="ml-2 text-good">[{t('inventory.equipped')}]</span>}
                      </div>
                      <div className="text-muted mt-1 text-sm">{describeEffects(it.effects, lang)}</div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {it.slot === 'potion' && <PixelButton variant="good" onClick={() => usePotion(r.id)}>{t('inventory.use')}</PixelButton>}
                        {it.slot === 'chest' && <PixelButton variant="gold" onClick={() => openChest(r.id)}>{t('inventory.use')}</PixelButton>}
                        {['weapon','armor','helmet','boots','amulet','book','gadget','tool'].includes(it.slot) && (
                          r.equipped
                            ? <PixelButton onClick={() => unequip(r.id)}>{t('inventory.unequip')}</PixelButton>
                            : <PixelButton variant="primary" onClick={() => equip(r.id)}>{t('inventory.equip')}</PixelButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PixelCard>
        );
      })}
    </div>
  );
}

function describeEffects(e: any, lang: 'ru' | 'en') {
  const parts: string[] = [];
  if (e.str) parts.push(`+${e.str} ${lang === 'en' ? 'STR' : 'СИЛ'}`);
  if (e.int) parts.push(`+${e.int} ${lang === 'en' ? 'INT' : 'ИНТ'}`);
  if (e.agi) parts.push(`+${e.agi} ${lang === 'en' ? 'AGI' : 'ЛОВ'}`);
  if (e.luc) parts.push(`+${e.luc} ${lang === 'en' ? 'LCK' : 'УД'}`);
  if (e.vit) parts.push(`+${e.vit} ${lang === 'en' ? 'VIT' : 'ЖИВ'}`);
  if (e.focus) parts.push(`+${e.focus} ${lang === 'en' ? 'FOC' : 'ФОК'}`);
  if (e.xp_mult)              parts.push(`+${Math.round((e.xp_mult - 1) * 100)}% XP`);
  if (e.damage_mult)          parts.push(`-${Math.round((1 - e.damage_mult) * 100)}% ${lang === 'en' ? 'damage' : 'урона'}`);
  if (e.extra_skips_per_week) parts.push(`+${e.extra_skips_per_week} ${lang === 'en' ? 'skips/week' : 'скипов/нед'}`);
  if (e.rare_drop_bonus)      parts.push(`+${Math.round(e.rare_drop_bonus * 100)}% ${lang === 'en' ? 'rare drop' : 'редкий дроп'}`);
  if (e.heal)                 parts.push(`+${e.heal} HP`);
  if (e.loot)                 parts.push(`${lang === 'en' ? 'loot' : 'дроп'}: ${e.loot}`);
  if (e.category_bonus) {
    for (const [k, v] of Object.entries(e.category_bonus)) {
      parts.push(`+${Math.round(((v as number) - 1) * 100)}% ${k}`);
    }
  }
  return parts.join(' · ');
}
