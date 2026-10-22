package com.simora.customer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.simora.customer.ui.navigation.SimoraNavGraph
import com.simora.customer.ui.theme.SimoraTheme
import com.simora.customer.viewmodel.SimoraViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: SimoraViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SimoraTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SimoraNavGraph(viewModel = viewModel)
                }
            }
        }
    }
}
