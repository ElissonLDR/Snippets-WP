<?php
/**
 * Integra Contact Form 7 com WP Job Manager
 *
 * - Hook: wpcf7_form_tag
 * - Preenche dinamicamente o select "vaga-escolhida" com posts do tipo job_listing
 * - Permite filtrar por tipo de vaga via atributo no formulário (data-tipo:slug)
 */

add_filter('wpcf7_form_tag', function ($tag) {

    if ($tag['name'] !== 'vaga-escolhida') {
        return $tag;
    }

    $tipo_slug = '';

    foreach ($tag['options'] as $opt) {
        if (strpos($opt, 'data-tipo:') !== false) {
            $tipo_slug = str_replace('data-tipo:', '', $opt);
        }
    }

    $args = [
        'post_type'      => 'job_listing',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ];

    if (!empty($tipo_slug)) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'job_listing_type',
                'field'    => 'slug',
                'terms'    => explode(',', $tipo_slug),
            ]
        ];
    }

    $jobs = get_posts($args);

    $options = [];

    foreach ($jobs as $job) {
        $options[$job->ID] = $job->post_title;
    }

    $tag['values'] = array_keys($options);
    $tag['labels'] = array_values($options);

    return $tag;

});