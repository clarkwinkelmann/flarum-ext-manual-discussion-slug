<?php

namespace ClarkWinkelmann\ManualDiscussionSlug\Extenders;

use ClarkWinkelmann\ManualDiscussionSlug\Validators\SlugValidator;
use Flarum\Discussion\Event\Saving;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SaveDiscussion implements ExtenderInterface
{
    use AssertPermissionTrait;

    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Saving::class, [$this, 'saving']);
    }

    public function saving(Saving $event)
    {
        // Can't use isset($data['attributes']['manualSlug']) as it ignores null values
        if (Arr::exists($event->data, 'attributes') && Arr::exists($event->data['attributes'], 'manualSlug')) {
            $this->assertCan($event->actor, 'clarkwinkelmann-manual-discussion-slug.edit');

            /**
             * @var $validator SlugValidator
             */
            $validator = app(SlugValidator::class);
            $validator->assertValid([
                'slug' => $event->data['attributes']['manualSlug'],
            ]);

            $event->discussion->manual_slug = $event->data['attributes']['manualSlug'];

            if (is_null($event->discussion->manual_slug)) {
                $event->discussion->slug = Str::slug($event->discussion->title);
            }
        }

        // Force slug to be equal to the manual slug whenever it changes
        if (!is_null($event->discussion->manual_slug) && $event->discussion->slug !== $event->discussion->manual_slug) {
            $event->discussion->slug = $event->discussion->manual_slug;
        }
    }
}
