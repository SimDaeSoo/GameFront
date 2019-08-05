<template>
  <div class="SpritePreviewPage">
    <div class="side">
      <div class="menu">
        <select v-model="selectedSprite" @change="changedSprite()">
          <option disabled value>please select sprite file</option>
          <option v-for="(item,index) in sprites" :key="index">{{item}}</option>
        </select>
        <span>Selected Sprite: {{ selectedSprite }}</span>
      </div>

      <div class="menu">
        <select v-model="selectedJson" @change="changedJson()">
          <option disabled value>please select json file</option>
          <option v-for="(item,index) in jsons" :key="index">{{item}}</option>
        </select>
        <span>Selected Json: {{ selectedJson }}</span>
      </div>

      <div class="menu">
        <select v-model="selectedAnimation" @change="changedAnimation()">
          <option disabled value>please select animation</option>
          <option v-for="(item,index) in animations" :key="index">{{item}}</option>
        </select>
        <span>Selected Animation: {{ selectedAnimation }}</span>
      </div>
    </div>

    <div class="main" ref="main">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script lang='ts'>
import axios from 'axios';
import Sprite from '../classes/Sprite';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class SpritePreviewPage extends Vue {
  private sprites: Array<string> = [];
  private selectedSprite: string = '';

  private jsons: Array<string> = [];
  private selectedJson: string = '';

  private canvas: CanvasRenderingContext2D | null = null;

  private animations: Array<string> = [];
  private selectedAnimation: string = '';
  private spriteInstance: Sprite | null = null;

  created() {
  }

  mounted() {
    this.initCanvas();
    this.fetchData();
    this.animationLoop();
  }

  // 음 돌아가는 시나리오를 좀 생각해 보자.
  // 1.화면의 오브제 update()
  // 2.캔버스 update()

  // 이건 스프라이트에 있어야 하는가 ? 루프로 프레임은 바꾸는데.. canvas update랑 의존성이 생겨버림.
  // TODO : Canvas Class를 만들고 => 객체 배열을 가지고 해당 객체들을 update 시킨 후, 화면 갱신으로 가면되지 않을까?
  // 해당 객체는 update() 가 반드시 있는, obj 여야함.
  private animationLoop(): void {
    setInterval(() => {
      if (this.spriteInstance) {
        this.spriteInstance.nextFrame();
        this.updateCanvas();
      }
    }, 100);
  }

  // Canvas 관련 Canvas class로 빼야할 것 같은데? => 스프라이트랑 의존성이 생겨버림.. 음 어떻게 해야하지
  private async updateCanvas(): Promise<void> {
    if (!this.canvas) {
      return;
    }
    // 화면 비우고
    this.canvas.clearRect(0, 0, (this.$refs.canvas as HTMLCanvasElement).width, (this.$refs.canvas as HTMLCanvasElement).height);

    // 다시 그린다.
    if (this.spriteInstance && this.spriteInstance.outputSprite) {
      const attr = this.spriteInstance.getAnimationAttr();
      this.canvas.drawImage(this.spriteInstance.outputSprite, attr.sx, attr.sy, attr.width, attr.height, attr.ex, attr.ey, attr.screenWidth, attr.screenHeight);
    }
  }

  // 캔버스 화면사이즈로 설정
  private initCanvas(): void {
    this.canvas = (this.$refs.canvas as HTMLCanvasElement).getContext('2d');
    if (this.canvas) {
      this.canvas.canvas.width = (this.$refs.main as HTMLElement).offsetWidth;
      this.canvas.canvas.height = (this.$refs.main as HTMLElement).offsetHeight;
    }
  }

  // 폴더안에 있는 파일목록 받아온다. => 폴더 지정이나, 파일 업로드? 있어야 하는듯..
  private async fetchData(): Promise<void> {
    const sprites = await axios.get('/sprites');
    sprites.data.forEach((sprite: string) => {
      this.sprites.push(sprite);
    });

    const jsons = await axios.get('/jsons');
    jsons.data.forEach((json: string) => {
      this.jsons.push(json);
    });
  }


  // Button Select변경 되었을 때 데이터 처리. ----------------------------------------------
  private changedAnimation(): void {
    if (this.spriteInstance) {
      this.spriteInstance.changeAnimation(this.selectedAnimation);
    }

    this.updateCanvas();
  }

  private async changedSprite(): Promise<void> {
    let changedFlag: boolean = false;
    this.jsons.forEach((json: string, i: number): void => {
      const name: string = json.replace('.json', '');

      if (this.selectedSprite.replace('.png', '') === name) {
        this.selectedJson = this.jsons[i];
        changedFlag = true;
      }
    });


    let jsonResponse;
    if (changedFlag) {
      jsonResponse = await axios('/assets/jsons/' + this.selectedJson);
    }
    this.spriteInstance = new Sprite(jsonResponse ? jsonResponse.data : { id: this.selectedSprite });
    this.animations = this.spriteInstance.animationIds();
    this.selectedAnimation = this.animations[0];

    this.updateCanvas();
  }

  private async changedJson(): Promise<void> {
    let changedFlag: boolean = false;
    this.sprites.forEach((sprite: string, i: number): void => {
      const name: string = sprite.replace('.png', '');

      if (this.selectedJson.replace('.json', '') === name) {
        this.selectedSprite = this.sprites[i];
        changedFlag = true;
      }
    });

    let jsonResponse;
    if (changedFlag) {
      jsonResponse = await axios('/assets/jsons/' + this.selectedJson);
    }
    this.spriteInstance = new Sprite(jsonResponse ? jsonResponse.data : { id: this.selectedSprite });
    this.animations = this.spriteInstance.animationIds();
    this.selectedAnimation = this.animations[0];

    this.updateCanvas();
  }
}
</script>

<style scoped>
.SpritePreviewPage {
  width: 100%;
  height: 100%;
  display: flex;
}

.side {
  width: 20%;
}

.menu {
  width: 100%;
  height: fit-content;
  display: grid;
  background-color: darkgray;
  padding-bottom: 5px;
  margin-bottom: 8px;
}

.side select {
  margin-bottom: 5px;
}

.side span {
  font-size: 13px;
  padding-left: 4px;
}

.main {
  width: 80%;
  height: 100%;
  padding-left: 8px;
}

.main canvas {
  background-color: #aaaaaa;
}
</style>
