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
        let csize = this.node.getContentSize();
        this.material = sprite.getMaterial(0);
        this.material.effect.setProperty('u_resolution', [csize.width, csize.height]);
    }

    protected update(dt:number):void{
        if(!this.material) return;
        this.time += dt;
        this.material.effect.setProperty('u_time', this.time);
    }
}