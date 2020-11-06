<template>
    <div class="app-container">
        <div class="overview-layout">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="out-border">
                        <div class="layout-title">商品总览</div>
                        <div style="padding: 40px">
                        <el-row>
                            <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">400</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">50</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">500</el-col>
                        </el-row>
                        <el-row class="font-medium">
                            <el-col :span="6" class="overview-item-title">已下架</el-col>
                            <el-col :span="6" class="overview-item-title">已上架</el-col>
                            <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                            <el-col :span="6" class="overview-item-title">全部商品</el-col>
                        </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="out-border">
                        <div class="layout-title">用户总览</div>
                        <div style="padding: 40px">
                        <el-row>
                            <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                            <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
                        </el-row>
                        <el-row class="font-medium">
                            <el-col :span="6" class="overview-item-title">今日新增</el-col>
                            <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                            <el-col :span="6" class="overview-item-title">本月新增</el-col>
                            <el-col :span="6" class="overview-item-title">会员总数</el-col>
                        </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="main" style="margin-top:50px;width: 100%;height: 400px;"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            charts: '',
            opinionData: ["550", "610", "480", "291", "390","702","810"]
        }
    },
    methods: {
        drawLine(id) {
            this.charts = echarts.init(document.getElementById(id))
            this.charts.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['近一周订单数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ["周一","周二","周三","周四","周五","周六","周日"]
                },
                yAxis: { type: 'value' },
                series: [{
                    name: '近一周订单数量',
                    type: 'line',
                    stack: '总量',
                    data: this.opinionData
                }]
            })
        }
    },
    //调用
    mounted() {
        this.drawLine('main');
    }
};
</script>

<style scoped>
    .app-container {
        margin-top: 40px;
        margin-left: 120px;
        margin-right: 120px;
    }
    .overview-layout {
        margin-top: 20px;
    }

    .overview-item-value {
        font-size: 24px;
        text-align: center;
    }

    .overview-item-title {
        margin-top: 10px;
        text-align: center;
    }
    .layout-title{
        color: #606266;
        padding: 15px 20px;
        background: #f2f6fc;
        font-weight: 700;
    }
    .out-border{
        border: 1px solid #000;
    }
    .color-danger{
        color: #f56c6c;
    }
</style>