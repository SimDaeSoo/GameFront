interface IChatBalloonData {
    src: string;
    leftWidth: number;
    topHeight: number;
    rightWidth: number;
    bottomHeight: number;
}
const DEFAULT_CHAT_BALLOON_DATA: IChatBalloonData = {
    src: 'nineSlice.png',
    leftWidth: 1,
    topHeight: 1,
    rightWidth: 1,
    bottomHeight: 1
}

export default class ChatBalloon extends PIXI.Container {
    private base: IChatBalloonData = DEFAULT_CHAT_BALLOON_DATA;

    constructor(text: string) {
        super();
        this.initialize(text);
    }

    private initialize(text: string): void {
        const parsingText: string = this.parseText(text);
        const textBox: PIXI.Text = this.makeText(parsingText);
        const chatPanel: PIXI.NineSlicePlane = this.makePanel(textBox);

        this.addChild(chatPanel);
        this.addChild(textBox);
    }

    private parseText(text: string): string {
        let result: string = '';
        let counting: number = 0;

        for (let i = 0; i < text.length; i++) {
            counting++;
            if (text[i] === ' ' && counting >= 18) {
                result += '\n';
                counting = 0;
            } else {
                result += text[i];
            }
        }

        return result;
    }

    private makeText(text: string): PIXI.Text {
        const textBox = new PIXI.Text(text,
            { fontSize: 10, fill: "black" }
        );
        textBox.anchor.x = 0.5;
        textBox.anchor.y = 0.5;

        return textBox;
    }
    private makePanel(textBox: PIXI.Text): PIXI.NineSlicePlane {
        const panel: PIXI.NineSlicePlane = new PIXI.NineSlicePlane(PIXI.Texture.from(this.base.src), this.base.leftWidth, this.base.topHeight, this.base.rightWidth, this.base.bottomHeight);
        panel.width = textBox.width + 8;
        panel.height = textBox.height + 8;
        panel.x -= Math.floor(panel.width / 2);
        panel.y -= Math.floor(panel.height / 2);

        return panel;
    }
}