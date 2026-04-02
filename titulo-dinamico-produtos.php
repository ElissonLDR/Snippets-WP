/**
 * Atualiza dinamicamente o título da página com base nos filtros de categoria e marca (URL params)
 * Atua no front-end, lendo product_cat e product_brand
 * Compatível com filtros AJAX (Elementor)
 * Uso: páginas de produtos com .titulo-dinamico h2
 * URLs:
 * https://v4amaral.com.br/vicato/todos-produtos/ ou  * https://vicato.com.br/todos-produtos/
 */

add_action('wp_footer', function () {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
    
        function getParams() {
            const params = new URLSearchParams(window.location.search);
            let category = null;
            let brand = null;
    
            params.forEach((value, key) => {
                if (key.includes('product_cat')) {
                    category = value;
                }
                if (key.includes('product_brand')) {
                    brand = value;
                }
            });
    
            return { category, brand };
        }
    
        function formatText(text) {
            if (!text) return '';
            return text
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }
    
        function updateTitle() {
            const el = document.querySelector('.titulo-dinamico h2');
            if (!el) return;
    
            const { category, brand } = getParams();
    
            let title = 'Todos produtos';
    
            if (brand && category) {
                title = `Marca selecionada: ${formatText(brand)} • Categoria selecionada: ${formatText(category)}`;
            } else if (brand) {
                title = `Marca selecionada: ${formatText(brand)}`;
            } else if (category) {
                title = `Categoria selecionada: ${formatText(category)}`;
            }
    
            el.innerHTML = title
    		.replace(/(Marca selecionada:\s)([^•]+)/, '$1<strong>$2</strong>')
    		.replace(/(Categoria selecionada:\s)(.+)/, '$1<strong>$2</strong>');
        }
    
        // Atualiza ao carregar
        updateTitle();
    
        // Atualiza ao clicar nos filtros (Elementor AJAX)
        document.body.addEventListener('click', function () {
            setTimeout(updateTitle, 500);
        });
    
    });
    </script>
    <?php
    });