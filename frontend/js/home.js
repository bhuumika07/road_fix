document.addEventListener('DOMContentLoaded', () => {
    initializeStatCounters();
});

function initializeStatCounters() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) {
        fetchStatsAndAnimate();
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fetchStatsAndAnimate();
                obs.disconnect();
            }
        });
    }, { threshold: 0.35 });

    observer.observe(statsSection);
}

async function fetchStatsAndAnimate() {
    try {
        const res = await fetch('/api/reports/stats', {
            headers: {
                'x-user-role': localStorage.getItem('userRole') || 'unknown',
                'x-user-id': localStorage.getItem('userId') || 'unknown',
                'x-user-name': localStorage.getItem('userName') || 'Unknown'
            }
        });
        const data = await res.json();
        
        let fixed = 0;
        let totalReported = 0;

        if (data.success && Array.isArray(data.data)) {
            data.data.forEach(stat => {
                if (stat.status === 'Resolved') fixed += stat.count;
            });
            totalReported = data.data.reduce((sum, item) => sum + item.count, 0);
        }
            
        animateCount('stat-reported', totalReported, 1400);
        animateCount('stat-fixed', fixed, 1400);
        animateCount('stat-citizens', getInitialNumericValue('stat-citizens'), 1700);
    } catch (e) {
        animateCount('stat-reported', 0, 1200);
        animateCount('stat-fixed', 0, 1200);
        animateCount('stat-citizens', getInitialNumericValue('stat-citizens'), 1700);
    }
}

function getInitialNumericValue(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const numeric = Number(String(el.textContent || '').replace(/,/g, '').trim());
    return Number.isFinite(numeric) ? numeric : 0;
}

function animateCount(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;

    const finalValue = Math.max(0, Number(target) || 0);
    const startValue = 0;
    el.textContent = '0';

    if (finalValue === 0) {
        return;
    }

    const startTs = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
        const elapsed = now - startTs;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const currentValue = Math.round(startValue + (finalValue - startValue) * eased);
        el.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            el.textContent = finalValue.toLocaleString();
        }
    }

    requestAnimationFrame(frame);
}
