document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    const nameInput = document.getElementById('nameInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusMessage = document.getElementById('statusMessage');

    function applyFilter() {
        const dateQuery = dateInput.value.toLowerCase().trim();
        const nameQuery = nameInput.value.toLowerCase().trim();

        statusMessage.textContent = 'Buscando...';
        statusMessage.style.color = '#333';

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || tabs.length === 0) {
                statusMessage.textContent = 'Nenhuma aba ativa.';
                statusMessage.style.color = 'red';
                return;
            }

            const activeTab = tabs[0];

            // Injeta a lógica de filtro em todos os frames da página ativa
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id, allFrames: true },
                func: (dateQ, nameQ) => {
                    try {
                        const courseSelect = document.querySelector('select[name="codCurso"]');
                        if (!courseSelect) {
                            return { success: false, reason: 'SelectNotFound' };
                        }

                        // Se é a primeira vez rodando neste select, guarda as opções originais no window
                        if (!window._sispOriginalOptions) {
                            window._sispOriginalOptions = [];
                            for (let i = 0; i < courseSelect.options.length; i++) {
                                const opt = courseSelect.options[i];
                                window._sispOriginalOptions.push({
                                    value: opt.value,
                                    text: opt.textContent || opt.innerText,
                                    selected: opt.selected
                                });
                            }
                        }

                        let currentSelectedValue = courseSelect.value;
                        let foundSelected = false;

                        // Limpa todas as opções de forma segura e cross-browser
                        courseSelect.options.length = 0;

                        // Recria e filtra baseado nos dados originais guardados
                        window._sispOriginalOptions.forEach(optData => {
                            // Sempre mantém o "Escolha um"
                            if (optData.value === '-1') {
                                const newOpt = new Option(optData.text, optData.value);
                                courseSelect.add(newOpt);
                                return;
                            }

                            const text = optData.text.toLowerCase();
                            const matchDate = dateQ === '' || text.includes(dateQ);
                            const matchName = nameQ === '' || text.includes(nameQ);

                            if (matchDate && matchName) {
                                const newOpt = new Option(optData.text, optData.value);
                                courseSelect.add(newOpt);
                                
                                if (optData.value === currentSelectedValue) {
                                    newOpt.selected = true;
                                    foundSelected = true;
                                }
                            }
                        });

                        // Se a opção selecionada anteriormente sumiu, volta para a primeira
                        if (!foundSelected && courseSelect.options.length > 0) {
                            courseSelect.selectedIndex = 0;
                            // Se dispararmos change aqui, a página vai recarregar. 
                            // O melhor é não disparar para não atrapalhar o usuário enquanto ele filtra.
                            // courseSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }

                        return { success: true };
                    } catch (err) {
                        return { success: false, reason: err.toString() };
                    }
                },
                args: [dateQuery, nameQuery]
            }, (injectionResults) => {
                if (chrome.runtime.lastError) {
                    statusMessage.textContent = 'Erro ao injetar script (Tente recarregar a página do SISP).';
                    statusMessage.style.color = 'red';
                    return;
                }

                // Verifica se algum dos frames obteve sucesso
                const success = injectionResults.some(frame => frame.result && frame.result.success);
                if (success) {
                    statusMessage.textContent = 'Filtros aplicados com sucesso!';
                    statusMessage.style.color = 'green';
                } else {
                    statusMessage.textContent = 'Lista de cursos não encontrada nesta página.';
                    statusMessage.style.color = 'orange';
                }
            });
        });
    }

    // Aplica o filtro ao clicar no botão Pesquisar
    searchBtn.addEventListener('click', applyFilter);

    // Permite aplicar o filtro pressionando 'Enter' no teclado
    dateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilter();
    });
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilter();
    });

    // Botão de limpar tudo
    clearBtn.addEventListener('click', () => {
        dateInput.value = '';
        nameInput.value = '';
        applyFilter();
    });
});
