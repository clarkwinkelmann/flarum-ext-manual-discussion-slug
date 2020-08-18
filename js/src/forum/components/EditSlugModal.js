import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

/* global m */

export default class EditSlugModal extends Modal {
    constructor(discussion) {
        super();

        this.discussion = discussion;

        const manualSlug = discussion.attribute('manualSlug');

        this.automatic = manualSlug === null;
        this.slug = manualSlug === null ? discussion.slug() : manualSlug;
        this.dirty = false;
        this.loading = false;
    }

    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.title');
    }

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                m('label', [
                    m('input', {
                        type: 'radio',
                        checked: this.automatic,
                        onchange: () => {
                            this.automatic = true;
                            this.dirty = true;
                        },
                        disabled: this.loading,
                    }),
                    ' ',
                    app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.automatic'),
                ]),
            ]),
            m('.Form-group', [
                m('label', [
                    m('input', {
                        type: 'radio',
                        checked: !this.automatic,
                        onchange: () => {
                            this.automatic = false;
                            this.dirty = true;

                            setTimeout(() => {
                                this.$('input[type=text]').focus();
                            }, 0);
                        },
                        disabled: this.loading,
                    }),
                    ' ',
                    app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.manual'),
                ]),
                m('input.FormControl', {
                    type: 'text',
                    maxlength: 255,
                    value: this.slug,
                    onchange: event => {
                        this.slug = event.target.value;
                        this.dirty = true;
                    },
                    disabled: this.automatic || this.loading,
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    disabled: !this.dirty,
                    loading: this.loading,
                    type: 'submit',
                    className: 'Button Button--primary',
                    children: app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.submit'),
                }),
                Button.component({
                    className: 'Button CancelButton',
                    children: app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.cancel'),
                    onclick() {
                        app.modal.close();
                    },
                }),
            ]),
        ]);
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.discussion.save({
            manualSlug: this.automatic ? null : this.slug,
        }).then(() => {
            this.loading = false;
            this.dirty = false;

            m.redraw();

            app.modal.close();
        }).catch(err => {
            this.loading = false;
            m.redraw();
            throw err;
        });
    }
}
