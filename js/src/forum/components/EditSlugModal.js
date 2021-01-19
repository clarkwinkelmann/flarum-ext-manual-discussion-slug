import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Switch from 'flarum/components/Switch';

/* global m */

export default class EditSlugModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        const {discussion} = this.attrs;

        const manualSlug = discussion.attribute('manualSlug');

        this.automatic = manualSlug === null;
        this.slug = this.automatic ? discussion.slug() : manualSlug;
        this.autoFormat = this.automatic || /^[a-z0-9_-]+$/.test(this.slug);
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
                    oninput: event => {
                        this.slug = this.autoFormat ? this.autoFormatValue(event.target.value) : event.target.value;
                        this.dirty = true;
                    },
                    disabled: this.automatic || this.loading,
                }),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.autoFormat,
                    onchange: value => {
                        this.autoFormat = value;

                        if (this.autoFormat && this.slug) {
                            this.slug = this.autoFormatValue(this.slug);
                            this.dirty = true;
                        }
                    },
                    disabled: this.automatic || this.loading,
                }, app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.autoFormat')),
            ]),
            m('.Form-group', [
                Button.component({
                    disabled: !this.dirty,
                    loading: this.loading,
                    type: 'submit',
                    className: 'Button Button--primary',
                }, app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.submit')),
                Button.component({
                    className: 'Button CancelButton',
                    onclick() {
                        app.modal.close();
                    },
                }, app.translator.trans('clarkwinkelmann-manual-discussion-slug.forum.modal.cancel')),
            ]),
        ]);
    }

    autoFormatValue(slug) {
        return slug.toLowerCase().replace(/\W+/g, '-');
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.attrs.discussion.save({
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
