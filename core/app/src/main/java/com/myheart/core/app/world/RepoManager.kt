package com.myheart.core.app.world

import com.myheart.core.app.EngineThread.Companion.assertEngineThread
import com.myheart.core.app.base.IPipeline
import com.myheart.core.app.base.repo.IRepo
import com.myheart.core.app.reborn.repo.DemoRepo
import com.myheart.core.app.utils.PerformanceUtils
import com.myheart.core.utils.Logger.f
import java.util.concurrent.ConcurrentHashMap

class RepoManager(// transient 关键字，解除Gson循环依赖
        @field:Transient private val world: World) : IPipeline<IRepo> {
    private val repoOrderArray: MutableList<IRepo> = ArrayList()
    private val repoMap: MutableMap<Class<out IRepo>, IRepo> = ConcurrentHashMap()
    private val methodMonitor = PerformanceUtils.Companion.MethodMonitor()
    fun onStart() {
        putIn(DemoRepo(world).enable())
    }

    /**
     * 遍历所有Repo，执行onStart
     */
    fun traversalOnStart() {
        traversal("onStart") { it.onStart() }
    }

    private fun putIn(repo: IRepo) {
        val repoClass: Class<out IRepo> = repo.javaClass
        check(!repoMap.containsKey(repoClass)) { "repo has already created." + repoClass.simpleName }
        f(TAG, "putIn", repoClass.simpleName)
        repoMap[repoClass] = repo
        repoOrderArray.add(repo)
    }

    operator fun <T : IRepo?> get(name: Class<out IRepo>): T {
        check(repoMap.containsKey(name)) { "RepoManager has not Repo, $name" }
        return repoMap[name] as T
    }

    fun onUpdate() {
        traversal("onBeforeUpdate") { it.onBeforeUpdate() }
        traversal("onUpdate") { it.onUpdate() }
    }

    fun onLateUpdate() {
        traversal("onLateUpdate") { it.onLateUpdate() }
    }

    fun onDestroy() {
        traversal("onDestroy") { it.onDestroy() }
        repoOrderArray.clear()
        repoMap.clear()
    }

    override fun traversal(name: String, action: (IRepo) -> Unit) {
        repoOrderArray.forEach {
            methodMonitor.start(it, name)
            action(it)
            methodMonitor.finish()
        }
    }

    override fun toString(): String {
        assertEngineThread()
        return repoOrderArray.stream().map { e: IRepo -> e.repoName + "[" + e.enable() + "]" }.toArray().contentToString()
    }

    fun dump() {
        f(TAG, "dump", "size", repoOrderArray.size, this.toString())
    }

    companion object {
        private const val TAG = "RepoManager"
    }
}