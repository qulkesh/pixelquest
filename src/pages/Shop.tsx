import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import ItemSprite from '../components/ItemSprite';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';

export default function Shop() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  const items = useGameStore(s => s.items);
  const profile = useGameStore(s => s.profile);
  const buy = useGameStore(s => s.buyItem);

  const grouped: Record<string, typeof items> = {};
  for (const it of items) (grouped[it.slot] ||= []).push(it);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-pixel text-lg text-cyan neon-text">{t('shop.title')}</h1>
        <div className="font-pixel text-gold neon-text">{profile?.gold} G</div>
      </div>

      {Object.entries(grouped).map(([slot, list]) => (
        <PixelCard key={slot} title={t('slot.' + slot)} accent="gold">
          <div className="grid md:grid-cols-3 gap-3">
            {list.map(it => {
              const name = lang === 'en' ? it.name_en : it.name_ru;
              const can = (profile?.gold ?? 0) >= it.price_gold;
              return (
                <div key={it.id} className="pixel-frame-soft p-3 flex gap-3 items-start">
                  <ItemSprite item={it} size={64} />
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className={`font-pixel text-sm rarity-${it.rarity} truncate`}>{name}</div>
                    <div className="text-muted text-sm">{t('rarity.' + it.rarity)}</div>
                    <div className="text-muted text-xs">{describeStats(it.effects, lang)}</div>
                    <div className="flex justify-between items-center mt-auto pt-2">
                      <span className="font-pixel text-gold">{it.price_gold} G</span>
                      <PixelButton variant={can ? 'gold' : 'default'} disabled={!can} onClick={() => buy(it.key)}>
                        {t('shop.buy')}
                      </PixelButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PixelCard>
      ))}
    </div>
  );
}

function describeStats(e: any, lang: 'ru' | 'en'): string {
  const out: string[] = [];
  if (e.str) out.push(`+${e.str} ${lang === 'en' ? 'STR' : 'СИЛ'}`);
  if (e.int) out.push(`+${e.int} ${lang === 'en' ? 'INT' : 'ИНТ'}`);
  if (e.agi) out.push(`+${e.agi} ${lang === 'en' ? 'AGI' : 'ЛОВ'}`);
  if (e.luc) out.push(`+${e.luc} ${lang === 'en' ? 'LCK' : 'УД'}`);
  if (e.vit) out.push(`+${e.vit} ${lang === 'en' ? 'VIT' : 'ЖИВ'}`);
  if (e.focus) out.push(`+${e.focus} ${lang === 'en' ? 'FOC' : 'ФОК'}`);
  if (e.xp_mult)     out.push(`+${Math.round((e.xp_mult - 1) * 100)}% XP`);
  if (e.damage_mult) out.push(`-${Math.round((1 - e.damage_mult) * 100)}% ${lang === 'en' ? 'DMG' : 'УР'}`);
  if (e.heal)        out.push(`+${e.heal} HP`);
  if (e.loot)        out.push(`${lang === 'en' ? 'loot' : 'дроп'}: ${e.loot}`);
  return out.join(' · ');
}
