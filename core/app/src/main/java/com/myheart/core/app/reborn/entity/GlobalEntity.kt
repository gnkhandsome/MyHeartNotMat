package com.myheart.core.app.reborn.entity

import com.myheart.core.app.base.entity.BaseEntity
import com.myheart.core.app.reborn.behavior.DemoBehavior
import com.myheart.core.app.world.World

class GlobalEntity(world: World) : BaseEntity(world) {

    override fun onStart() {
        addBehavior(DemoBehavior(world))
    }
}
