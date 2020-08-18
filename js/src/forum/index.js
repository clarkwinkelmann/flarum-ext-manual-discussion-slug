import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import Button from 'flarum/components/Button';
import EditSlugModal from './components/EditSlugModal';

app.initializers.add('clarkwinkelmann/manual-discussion-slug', () => {
    extend(DiscussionControls, 'moderationControls', (items, discussion) => {
        if (!app.forum.attribute('clarkwinkelmannManualDiscussionSlugCanEdit')) {
            return;
        }

        items.add('clarkwinkelmann-manual-discussion-slug', Button.component({
            icon: 'fas fa-i-cursor',
            children: app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.controls.edit'),
            onclick() {
                app.modal.show(new EditSlugModal(discussion));
            },
        }));
    });
});
