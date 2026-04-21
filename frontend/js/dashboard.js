document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    // Dashboard State
    let allReports = [];
    const container = document.getElementById('reports-container');
    const searchInput = document.getElementById('search-input');
    const filterCat = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    const sortOrder = document.getElementById('sort-order');
    const filterBadge = document.getElementById('filter-badge');
    const filterCount = document.getElementById('filter-count');
    const filterBar = document.getElementById('filter-bar');
    const toggleFiltersBtn = document.getElementById('toggle-filters');

    if(toggleFiltersBtn && filterBar) {
        toggleFiltersBtn.addEventListener('click', () => {
            const isActive = filterBar.classList.toggle('active');
            toggleFiltersBtn.classList.toggle('toggle-filters-active', isActive);
        });
    }
    
    // Socket.io
    const socket = io();
    const liveIndicator = document.getElementById('live-indicator');
    const liveDot = document.getElementById('live-dot');
    const liveText = document.getElementById('live-text');

    socket.on('connect', () => {
        if (liveDot) liveDot.classList.remove('offline');
        if (liveText) liveText.textContent = 'Live';
        if (liveIndicator) liveIndicator.style.color = '#22c55e';
    });
    
    socket.on('disconnect', () => {
        if (liveDot) liveDot.classList.add('offline');
        if (liveText) liveText.textContent = 'Offline';
        if (liveIndicator) liveIndicator.style.color = '#9ca3af';
    });

    socket.on('report:new', (report) => {
        allReports.push(report);
        renderReports();
        if(window.showToast) window.showToast(`📍 New: ${report.title}`, 'info');
    });

    socket.on('report:updated', (updatedData) => {
        const idx = allReports.findIndex(r => r.id.toString() === updatedData.id.toString());
        if (idx !== -1) {
            allReports[idx] = { ...allReports[idx], ...updatedData };
            renderReports();
            if(window.showToast) window.showToast(`🔄 Updated to ${updatedData.status || 'new status'}`, 'info');
        }
    });

    socket.on('report:deleted', (id) => {
        allReports = allReports.filter(r => r.id.toString() !== id.toString());
        renderReports();
        if(window.showToast) window.showToast('🗑️ Report removed', 'warning');
    });

    socket.on('report:upvoted', (data) => {
        const idx = allReports.findIndex(r => r.id.toString() === data.id.toString());
        if (idx !== -1) {
            allReports[idx].upvotes = data.upvotes;
            if(data.userEmail && data.userEmail !== localStorage.getItem('userEmail')) {
                renderReports(); 
            } else {
                const countBadge = document.getElementById(`upvote-count-${data.id}`);
                if(countBadge) countBadge.textContent = data.upvotes;
            }
        }
    });

    const renderSkeleton = () => {
        container.innerHTML = Array(4).fill().map(() => `
            <div class="report-card" style="pointer-events:none;">
                <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                    <div style="width:80px; height:24px; background:#e2e8f0; border-radius:20px; animation:pulse 1.5s infinite"></div>
                    <div style="width:80px; height:24px; background:#e2e8f0; border-radius:20px; animation:pulse 1.5s infinite"></div>
                </div>
                <div style="width:200px; height:28px; background:#e2e8f0; border-radius:8px; margin-bottom:12px; animation:pulse 1.5s infinite"></div>
                <div style="width:100%; height:16px; background:#e2e8f0; border-radius:8px; margin-bottom:8px; animation:pulse 1.5s infinite"></div>
                <div style="width:80%; height:16px; background:#e2e8f0; border-radius:8px; margin-bottom:24px; animation:pulse 1.5s infinite"></div>
                <div style="display:flex; gap:16px; border-top:1px solid #f1f5f9; padding-top:16px; animation:pulse 1.5s infinite">
                     <div style="width:80px; height:36px; background:#e2e8f0; border-radius:20px;"></div>
                </div>
            </div>
        `).join('');
    };

    const fetchReports = async () => {
        renderSkeleton();
        try {
            const res = await fetch('/api/reports', {
                headers: {
                    'x-user-role': role,
                    'x-user-id': userId,
                    'x-user-email': localStorage.getItem('userEmail')
                }
            });
            const data = await res.json();
            if (data.success) {
                allReports = data.data;
                renderReports();
            } else {
                container.innerHTML = `<div class="error-msg show" style="display:flex;"><i class="fa-solid fa-circle-xmark"></i> <span>Failed to load reports: ${data.error}</span></div>`;
            }
        } catch (e) {
            container.innerHTML = `<div class="error-msg show" style="display:flex;"><i class="fa-solid fa-circle-xmark"></i> <span>Network error. Make sure server is running.</span></div>`;
        }
    };

    const renderReports = () => {
        let filtered = [...allReports];
        const search = searchInput.value.toLowerCase();
        const cat = filterCat.value;
        const stat = filterStatus.value;
        const sort = sortOrder.value;

        if (search) filtered = filtered.filter(r => r.title.toLowerCase().includes(search) || r.description.toLowerCase().includes(search));
        if (cat !== 'all') filtered = filtered.filter(r => r.category === cat);
        if (stat !== 'all') filtered = filtered.filter(r => r.status === stat);

        let activeFilters = 0;
        if(search) activeFilters++;
        if(cat !== 'all') activeFilters++;
        if(stat !== 'all') activeFilters++;
        
        if(activeFilters > 0) {
            filterBadge.classList.remove('hidden');
            filterCount.textContent = `${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`;
        } else {
            filterBadge.classList.add('hidden');
        }

        if (sort === 'newest') filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sort === 'oldest') filtered.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (sort === 'upvotes') filtered.sort((a,b) => (b.upvotes||0) - (a.upvotes||0));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:16px; border:1px solid var(--border);">
                    <i class="fa-solid fa-road" style="font-size:4rem; color: #94a3b8; margin-bottom:16px;"></i>
                    <h3 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">No Reports Found</h3>
                    <p style="color:var(--text-muted); margin-bottom:24px;">Try adjusting your filters or be the first to report an issue!</p>
                    <a href="report.html" class="btn-primary-hero"><i class="fa-solid fa-plus"></i> Report an Issue</a>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(r => {
            const uId = localStorage.getItem('userId');
            const hasVoted = r.upvotedBy && Array.isArray(r.upvotedBy) && r.upvotedBy.includes(uId);
            return `
            <div class="report-card" data-id="${r.id}">
                <div class="report-img-wrapper">
                    ${r.image_url ? `
                        <img src="${r.image_url}" class="report-img" onclick="openImageModal('${r.image_url}')" alt="Report image">
                    ` : `
                        <div class="report-img report-img-placeholder"><i class="fa-solid fa-road"></i></div>
                    `}
                    <span class="cat-badge">${r.category}</span>
                </div>
                <div class="report-content">
                    <span class="status-badge ${r.status === 'Reported' ? 'status-reported' : r.status === 'In Progress' ? 'status-in-progress' : 'status-resolved'}">${r.status}</span>
                    <h3 class="report-title">${r.title}</h3>
                    <p class="report-desc">${r.description}</p>
                    <div class="report-meta">
                        <div class="report-meta-item"><i class="fa-solid fa-location-dot"></i> ${parseFloat(r.latitude || 0).toFixed(4)}, ${parseFloat(r.longitude || 0).toFixed(4)}</div>
                        <div class="report-meta-item"><i class="fa-solid fa-calendar"></i> ${new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="report-actions">
                        <button type="button" class="view-details-link" onclick="toggleDetails('${r.id}')">View Details <i class="fa-solid fa-arrow-right"></i></button>
                        <button class="btn-upvote ${hasVoted ? 'voted' : ''}" onclick="toggleUpvote('${r.id}')">
                            <i class="fa-solid fa-thumbs-up"></i> <span id="upvote-count-${r.id}">${r.upvotes || 0}</span>
                        </button>
                    </div>
                    <div id="report-details-${r.id}" style="display:none; margin-top:10px; padding:12px; border:1px solid var(--border); border-radius:10px; background:var(--bg-main);">
                        <div style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:6px;">
                            <strong>Tracking ID:</strong> #${r.id}
                        </div>
                        <div style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:6px;">
                            <strong>Category:</strong> ${r.category}
                        </div>
                        <div style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:6px;">
                            <strong>Status:</strong> ${r.status}
                        </div>
                        <div style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:6px;">
                            <strong>Reported On:</strong> ${new Date(r.createdAt).toLocaleString()}
                        </div>
                        <div style="font-size:0.86rem; color:var(--text-secondary);">
                            <strong>Full Description:</strong> ${r.description}
                        </div>
                    </div>
                    <div class="report-admin-actions">
                        ${(role === 'admin' || role === 'inspector') ? `
                            <select onchange="updateStatus('${r.id}', this.value)">
                                <option value="" disabled selected>Change Status</option>
                                <option value="Reported">Reported</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        ` : ''}
                        ${role === 'admin' ? `
                            <button class="btn-delete-report" onclick="deleteReport('${r.id}')"><i class="fa-solid fa-trash"></i></button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;}).join('');
    };

    [searchInput, filterCat, filterStatus, sortOrder].forEach(el => {
        el.addEventListener('input', renderReports);
        el.addEventListener('change', renderReports);
    });

    window.toggleDetails = (id) => {
        const details = document.getElementById(`report-details-${id}`);
        if (!details) return;
        const isOpen = details.style.display === 'block';
        details.style.display = isOpen ? 'none' : 'block';
    };

    window.toggleUpvote = async (id) => {
        const uId = localStorage.getItem('userId');
        try {
            const res = await fetch(`/api/reports/${id}/upvote`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': role,
                    'x-user-id': uId,
                    'x-user-email': localStorage.getItem('userEmail')
                }
            });
            const data = await res.json();
            if(data.success) {
                const idx = allReports.findIndex(r => r.id.toString() === id.toString());
                if(idx !== -1) {
                    allReports[idx].upvotes = data.upvotes;
                    if(!allReports[idx].upvotedBy) allReports[idx].upvotedBy = [];
                    if(data.isUpvoted) {
                        if(!allReports[idx].upvotedBy.includes(uId)) allReports[idx].upvotedBy.push(uId);
                    } else {
                        allReports[idx].upvotedBy = allReports[idx].upvotedBy.filter(e => e !== uId);
                    }
                    renderReports();
                }
            } else {
                if(window.showToast) window.showToast(data.error || 'Failed to upvote', 'error');
            }
        } catch(e) {
            if(window.showToast) window.showToast('Network error', 'error');
        }
    };

    window.updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/reports/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': role,
                    'x-user-id': userId,
                    'x-user-name': name
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if(!res.ok || !data.success) {
                if(window.showToast) window.showToast(data.error || 'Failed to update status', 'error');
                renderReports();
            } else {
                const idx = allReports.findIndex(r => r.id.toString() === id.toString());
                if(idx !== -1) {
                    allReports[idx].status = newStatus;
                    renderReports();
                }
            }
        } catch(e) {
            if(window.showToast) window.showToast('Network error', 'error');
            renderReports();
        }
    };

    window.deleteReport = async (id) => {
        if(!confirm('Are you sure you want to delete this report?')) return;
        const card = document.querySelector(`.report-card[data-id="${id}"]`);
        if(card) {
            card.classList.add('removing');
            setTimeout(async () => {
                try {
                    const res = await fetch(`/api/reports/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'x-user-role': role,
                            'x-user-id': userId,
                            'x-user-name': name
                        }
                    });
                    const data = await res.json();
                    if(!res.ok || !data.success) {
                        if(window.showToast) window.showToast(data.error || 'Failed to delete report', 'error');
                        card.classList.remove('removing');
                        renderReports();
                    }
                } catch(e) {
                    if(window.showToast) window.showToast('Network error', 'error');
                    card.classList.remove('removing');
                    renderReports();
                }
            }, 300); // match animation
        }
    };

    // Modal
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementById('close-modal');

    window.openImageModal = (src) => {
        modalImg.src = src;
        modal.classList.remove('hidden');
    };

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.add('hidden');
    });

    fetchReports();
});
