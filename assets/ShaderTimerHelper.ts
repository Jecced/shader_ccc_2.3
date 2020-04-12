const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class ShaderTimerHelper extends cc.Component {

    private material:cc.Material = null;

    private time:number = 0;

    protected onLoad () {
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }
        this.material = sprite.getMaterial(0);
    }

    protected update(dt:number):void{
        if(!this.material) return;
        this.time += dt;
        this.material.setProperty('u_time', this.time);
    }
}