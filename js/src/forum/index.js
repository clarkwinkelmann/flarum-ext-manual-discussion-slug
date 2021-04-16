import {extend} from 'flarum/common/extend';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import Button from 'flarum/common/components/Button';
import EditSlugModal from './components/EditSlugModal';

/* global app */

app.initializers.add('clarkwinkelmann/manual-discussion-slug', () => {
    extend(DiscussionControls, 'moderationControls', (items, discussion) => {
        if (!app.forum.attribute('clarkwinkelmannManualDiscussionSlugCanEdit')) {
            return;
        }

        items.add('clarkwinkelmann-manual-discussion-slug', Button.component({
            icon: 'fas fa-i-cursor',
            onclick() {
                app.modal.show(EditSlugModal, {
                    discussion,
                });
            },
        }, app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.controls.edit')));
    });
});
