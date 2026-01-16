import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlatformStats, getOrdersLast7Days } from "../../api/stats.api";
import { getProducts } from "../../api/products.api";
import { getGallery } from "../../api/gallery.api";

interface StatsSummary {
  products: number;
  galleryItems: number;
  activity: number;
}

interface PlatformStats {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
  activitiesCount: number;
}

interface ChartDay {
  dayLabel: string;
  orders: number;
  revenue: number;
}

interface OrdersChartDto {
  days: string[];
  orders: number[];
  revenue: number[];
}

function formatPLN(v: number) {
  return `${v.toFixed(2)} zł`;
}

const BLOCK_WIDTH = 900;

export default function AdminStatsPage() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<StatsSummary>({
    products: 0,
    galleryItems: 0,
    activity: 0,
  });

  const [platform, setPlatform] = useState<PlatformStats>({
    purchasedCount: 0,
    totalSpent: 0,
    ratedCount: 0,
    averageRating: 0,
    commentsCount: 0,
    activitiesCount: 0,
  });

  const [chart, setChart] = useState<ChartDay[]>([]);

  useEffect(() => {
    getPlatformStats().then(stats => {
      setPlatform(stats);
      setSummary(prev => ({
        ...prev,
        activity: stats.activitiesCount,
      }));
    });

    getProducts().then(products => {
      setSummary(prev => ({
        ...prev,
        products: products.length,
      }));
    });

    getGallery().then(gallery => {
      setSummary(prev => ({
        ...prev,
        galleryItems: gallery.length,
      }));
    });

    getOrdersLast7Days().then((data: OrdersChartDto) => {
      setChart(
        data.days.map((d, i) => ({
          dayLabel: d,
          orders: data.orders[i] ?? 0,
          revenue: data.revenue[i] ?? 0,
        }))
      );
    });
  }, []);

  const maxRevenue = Math.max(...chart.map(d => d.revenue), 1);
  const maxOrders = Math.max(...chart.map(d => d.orders), 1);

  return (
    <div className="admin-root">
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              left: 0,
              padding: "6px 14px",
              fontSize: 13,
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ← Wstecz
          </button>

          <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>
            Statystyki
          </div>
        </div>

        <div
          style={{
            width: BLOCK_WIDTH,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            { label: "Produkty", value: summary.products },
            { label: "Arcydzieła", value: summary.galleryItems },
            { label: "Aktywności", value: summary.activity },
          ].map(x => (
            <div
              key={x.label}
              className="admin-block glass"
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 900 }}>{x.value}</div>
              <div style={{ opacity: 0.8, marginTop: 8 }}>{x.label}</div>
            </div>
          ))}
        </div>

        <div
          className="admin-block glass"
          style={{ padding: 32, width: BLOCK_WIDTH, margin: "0 auto" }}
        >
          <div style={{ fontWeight: 900, marginBottom: 24 }}>
            Statystyki platformy
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 14 , columnGap: 24}}>
              <div>✅ Kupione produkty</div>
              <div>{platform.purchasedCount}</div>

              <div>💰 Wydane pieniądze</div>
              <div>{formatPLN(platform.totalSpent)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 14 }}>
              <div>⭐ Ocenione</div>
              <div>{platform.ratedCount}</div>

              <div>⭐ Średnia</div>
              <div>{platform.averageRating}</div>

              <div>💬 Komentarze</div>
              <div>{platform.commentsCount}</div>
            </div>
          </div>
        </div>

        <div
          className="admin-block glass"
          style={{ padding: 32, width: BLOCK_WIDTH, margin: "0 auto" }}
        >
          <div style={{ fontWeight: 900, marginBottom: 24 }}>
            Zamówienia vs Przychód (7 dni)
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 24,
              alignItems: "end",
              height: 240,
            }}
          >
            {chart.map((d, idx) => {
              const revenueH = (d.revenue / maxRevenue) * 150;
              const ordersH = (d.orders / maxOrders) * 150;

              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ width: 14, height: Math.max(4, ordersH), borderRadius: 6, background: "rgba(37,99,235,0.8)" }} />
                    <div style={{ width: 14, height: Math.max(4, revenueH), borderRadius: 6, background: "rgba(46,125,50,0.8)" }} />
                  </div>

                  <div style={{ fontSize: 11, opacity: 0.8, marginTop: 8, textAlign: "center" }}>
                    <div>{d.orders} zam.</div>
                    <div>{formatPLN(d.revenue)}</div>
                  </div>

                  <div style={{ fontWeight: 800, marginTop: 6, opacity: 0.75 }}>
                    {d.dayLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}