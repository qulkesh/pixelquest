import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
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
                <div key={it.id} className="pixel-frame-soft p-3 flex flex-col gap-2">
                  <div className={`font-pixel text-sm rarity-${it.rarity}`}>
                    <span className="mr-2">{it.icon}</span>{name}
                  </div>
                  <div className="text-muted text-sm">{t('rarity.' + it.rarity)}</div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-pixel text-gold">{it.price_gold} G</span>
                    <PixelButton variant={can ? 'gold' : 'default'} disabled={!can} onClick={() => buy(it.key)}>
                      {t('shop.buy')}
                    </PixelButton>
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
