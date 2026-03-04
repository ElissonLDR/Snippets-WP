(() => {

    const WHATS_NUMBER = "555196471955"

    const PLANS = [
        { id: '600', name: '600MB', price: 'R$ 109,90/mês', quotas: { standard: 1, advanced: 0, premium: 0 }, badges: ['1 app Standard'] },
        { id: '700a', name: '700MB (Standard + Advanced)', price: 'R$ 129,90/mês', quotas: { standard: 1, advanced: 1, premium: 0 }, badges: ['1 Standard', '1 Advanced'] },
        { id: '700p', name: '700MB (Standard + Premium)', price: 'R$ 129,90/mês', quotas: { standard: 1, advanced: 0, premium: 1 }, badges: ['1 Standard', '1 Premium'] },
        { id: '800', name: '800MB', price: 'R$ 149,90/mês', quotas: { standard: 1, advanced: 1, premium: 1 }, badges: ['1 Standard', '1 Advanced', '1 Premium'] },
        { id: '1000', name: '1GB', price: 'R$ 199,90/mês', quotas: { standard: 1, advanced: 1, premium: 1 }, badges: ['1 Standard', '1 Advanced', '1 Premium'] }
    ]

    const APPS = {
        standard: [
            { k: 'Deezer', img: 'https://masternetrs.com.br/wp-content/uploads/2025/09/Logotipo-Deezer.webp' },
            { k: 'Ubook Plus', img: 'https://masternetrs.com.br/wp-content/uploads/2025/09/Logotipo-ubook.webp' }
        ],
        advanced: [
            { k: 'Paramount+', img: 'https://masternetrs.com.br/wp-content/uploads/2025/09/Logotipo-Paramount.webp' }
        ],
        premium: [
            { k: 'Max', img: 'https://masternetrs.com.br/wp-content/uploads/2025/09/Logotipo-max.webp' }
        ]
    }

    const state = { planId: null, quotas: { standard: 0, advanced: 0, premium: 0 }, selected: { standard: new Set(), advanced: new Set(), premium: new Set() } }

    const $ = (s, p = document) => p.querySelector(s)
    const $a = (s, p = document) => Array.from(p.querySelectorAll(s))

    const elPlans = $(".mn-plans")
    const elBtn = $("#mn-whats")

    function renderPlans() {
        elPlans.innerHTML = PLANS.map(p => `
    <label class="mn-plan" data-plan="${p.id}" aria-checked="false">
    <input type="radio" name="plan" value="${p.id}">
    <h5>${p.name}</h5>
    <div class="mn-badges">${p.badges.join(', ')}</div>
    <small>${p.price}</small>
    </label>`).join('')
    }

    function renderApps() {
        Object.keys(APPS).forEach(cat => {
            const box = $(".mn-apps--" + cat)
            box.innerHTML = APPS[cat].map(a => `
    <div class="mn-chip" data-cat="${cat}" data-app="${a.k}" aria-checked="false" aria-disabled="true">
    <img src="${a.img}">
    <h6>${a.k}</h6>
    <div class="mn-check">✓</div>
    </div>`).join('')
        })
    }

    function setPlan(id) {

        const plan = PLANS.find(p => p.id === id)
        if (!plan) return

        $a(".mn-plan").forEach(l => {
            l.setAttribute("aria-checked", l.dataset.plan === id)
        })

        state.planId = id
        state.quotas = { ...plan.quotas }

        ["standard", "advanced", "premium"].forEach(cat => {
            state.selected[cat].clear()
        })

        update()
    }

    function toggleApp(cat, app) {

        if (!state.planId) return

        const set = state.selected[cat]

        if (set.has(app)) {
            set.delete(app)
        } else if (set.size < state.quotas[cat]) {
            set.add(app)
        }

        update()
    }

    function update() {

        ["standard", "advanced", "premium"].forEach(cat => {

            const need = state.quotas[cat]
            const have = state.selected[cat].size

            $a(`.mn-chip[data-cat="${cat}"]`).forEach(chip => {

                const checked = state.selected[cat].has(chip.dataset.app)

                chip.setAttribute("aria-checked", checked)

                let disable = true

                if (need > 0) {
                    disable = false
                    if (!checked && have >= need) disable = true
                }

                chip.setAttribute("aria-disabled", disable)

            })

        })

        const ready = state.planId && ["standard", "advanced", "premium"].every(cat => state.selected[cat].size === state.quotas[cat])

        elBtn.disabled = !ready

    }

    function buildMessage() {

        const p = PLANS.find(x => x.id === state.planId)

        return `Olá! Quero o plano ${p?.name}
    Apps:
    Standard: ${[...state.selected.standard].join(", ") || "—"}
    Advanced: ${[...state.selected.advanced].join(", ") || "—"}
    Premium: ${[...state.selected.premium].join(", ") || "—"}`

    }

    function send() {

        const msg = encodeURIComponent(buildMessage())
        const url = `https://api.whatsapp.com/send?phone=${WHATS_NUMBER}&text=${msg}`

        window.open(url, "_blank")

    }

    renderPlans()
    renderApps()

    elPlans.addEventListener("change", e => setPlan(e.target.value))

    document.addEventListener("click", e => {

        const chip = e.target.closest(".mn-chip")

        if (!chip) return
        if (chip.getAttribute("aria-disabled") === "true") return

        toggleApp(chip.dataset.cat, chip.dataset.app)

    })

    elBtn.addEventListener("click", send)

})()