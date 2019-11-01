import { Vue, Prop } from "vue-property-decorator";

export default class BaseUI extends Vue {
    @Prop()
    public ui: any;

    public on(eventName: string, listener: any): any {
        this.ui.on(eventName, listener);
    }

    public emit(eventName: string, ...args): any {
        this.ui.emit(eventName, ...args);
    }
}