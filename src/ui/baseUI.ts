import { Vue, Prop } from "vue-property-decorator";

export default class BaseUI extends Vue {
    @Prop()
    public ui: any;

    public on(event, listener): any {
        this.ui.on(event, listener);
    }

    public emit(event, ...args): any {
        this.ui.emit(event, ...args);
    }
}