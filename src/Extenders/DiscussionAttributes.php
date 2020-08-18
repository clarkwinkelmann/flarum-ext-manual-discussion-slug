<?php

namespace ClarkWinkelmann\ManualDiscussionSlug\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            if ($event->actor->can('clarkwinkelmann-manual-discussion-slug.edit')) {
                $event->attributes['manualSlug'] = $event->model->manual_slug;
            }
        }
    }
}
