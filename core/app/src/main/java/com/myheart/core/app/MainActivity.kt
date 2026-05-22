package com.myheart.core.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.myheart.core.app.databinding.ActivityMainBinding
import com.myheart.core.sdk.DataChainManager

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var dataChainManager: DataChainManager


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }




    override fun onDestroy() {
        dataChainManager.unbind()
        super.onDestroy()
    }
}
