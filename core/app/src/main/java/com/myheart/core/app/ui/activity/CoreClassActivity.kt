package com.myheart.core.app.ui.activity

import android.view.LayoutInflater
import com.myheart.core.app.databinding.ActivityMainBinding
import com.myheart.core.app.ui.base.BaseActivity
import com.myheart.core.app.ui.viewmodel.TestViewModel

class CoreClassActivity : BaseActivity<ActivityMainBinding, TestViewModel>() {


    override fun getViewModelClass() = TestViewModel::class.java


    override fun initViewBinding(inflater: LayoutInflater) = ActivityMainBinding.inflate(inflater)

    var count = 0

    override fun initView() {
        binding.testViewModel = viewModel as TestViewModel
        binding.btnSendIpc.setOnClickListener {
            viewModel.demoViewModelStore?.text?.setValue("发送数据到sdkViewModelCount==${count++}")
        }
    }
}