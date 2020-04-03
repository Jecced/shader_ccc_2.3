const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class ShaderTimerHelper extends cc.Component {

    private material:cc.Material = null;

    protected onLoad () {
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }
        this.material = sprite.getMaterial(0);
        // 用来传递 demo 中 u_resolution 值 这个值被初始化之后就不会变化,所以只用在onLoad阶段传递一次即可
        let csize = this.node.getContentSize();
        this.material.effect.setProperty('u_resolution', [csize.width, csize.height]);
    }
}