/**
 * Scroll automático após uso de filtro no Elementor (WordPress)
 *
 * O que faz:
 * Após o usuário clicar em um filtro de produtos (.e-filter-item),
 * o script aguarda a atualização AJAX e realiza um scroll suave
 * até a seção de produtos (.topo-produtos).
 *
 * Onde atua:
 * O código é injetado no footer do site via hook `wp_footer`,
 * garantindo execução após o carregamento do DOM e compatibilidade
 * com filtros dinâmicos do Elementor.
 *
 * Objetivo:
 * Melhorar a experiência do usuário, evitando que ele permaneça
 * no meio da página após aplicar um filtro.
 *
 * Observações:
 * - Pode ser necessário ajustar o offset (150px) dependendo de headers fixos
 * - Funciona com carregamento dinâmico (AJAX) do Elementor
 *
 * Exemplo / referência:
 * https://vicato.com.br/todos-produtos/ ou https://v4amaral.com.br/vicato/todos-produtos/
 */

add_action('wp_footer', function () {
    ?>
    <script>
        (function () {

            document.addEventListener('DOMContentLoaded', function () {

                function scrollToTopoProdutos() {
                    
                    const target = document.querySelector('.topo-produtos');

                    if (!target) return;

                    const offset = 150; // ajuste se tiver header fixo
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }

                // Delegação (funciona com AJAX do Elementor)
                document.addEventListener('click', function (e) {
                    const btn = e.target.closest('.e-filter-item');

                    if (!btn) return;

                    // Aguarda o filtro aplicar
                    setTimeout(function () {
                        scrollToTopoProdutos();
                    }, 150);
                });

            });

        })();
    </script>
    <?php
});