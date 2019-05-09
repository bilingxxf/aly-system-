<template>
    <div class="slider" ref="slider">
        <div class="month" style="display: flex; justify-content: space-around;">
            <span style="margin-top: 0.4rem;" v-for="(item, index) in month" :key="index">{{ item }}</span>
        </div>
        <div class="process" :style="{ width }"></div>
        <div class="thunk" ref="trunk" :style="{ left }">
            <div class="block">||</div>
            <div class="tips">
                <span>{{ scale | filterMonth }}</span>
                <i class="fas fa-caret-down"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    props: ['min', 'max', 'value'],
    data() {
        return {
            slider: null,
            thunk: null,
            per: this.value,
            month: [1, 2, 3, 4, 5, 6, 7, 8, 9, '1年', '2年', '3年' ]
        }
    },
    //渲染到页面的时候
    mounted() {
        this.slider = this.$refs.slider;
        this.thunk = this.$refs.trunk;
        var _this = this;
        this.thunk.onmousedown = function(e) {
            var width = parseInt(_this.width);
            var disX = e.clientX;
            document.onmousemove = function(e) {
                var newWidth = e.clientX - disX + width;
                // 拖拽的时候得到新的百分比
                var scale = newWidth / _this.slider.offsetWidth;
                _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min);
                _this.per = Math.max(_this.per, _this.min);
                _this.per = Math.min(_this.per, _this.max);
            }
            document.onmouseup = function() {
                document.onmousemove = document.onmouseup = null;
            }
            return false;
        }
    },
    filters: {
        filterMonth(value) {
            var num = value * 12;
            num = Math.ceil(num);
            if (num == 10) {
                num = 12;
            } else if (num == 11) {
                num = 24
            } else if (num == 12) {
                num = 36;
            }
            return num;
        }
    },
    computed: {
        scale() {
            var month = (this.per - this.min) / (this.max - this.min);
            this.$emit('currentMonth', Math.floor(month * 12 + 1));
            return month;
        },
        width() {
            if (this.slider) {
                return this.slider.offsetWidth * this.scale + 'px';
            } else {
                return 0 + 'px'
            }
        },
        left() {
            if (this.slider) {
                return this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2 + 'px';
            } else {
                return 0 + 'px'
            }
        }
    },
}
</script>
<style scoped>
.box {
    margin: 5rem auto 0;
    width: 80%;
}

.clear:after {
    content: '';
    display: block;
    clear: both;
}

.slider {
    position: relative;
    width: 20rem;
    height: 1.6rem;
    background: #e4e7ed;
    border-radius: 0.25rem;
    cursor: pointer;
}
.slider .month {
    width: 100%;
    height: 100%;
}
.slider .month span {
    color: #999;
    font-size: 0.6rem;
}

.slider .process {
    position: absolute;
    left: 0;
    top: 0;
    width: 5.6rem;
    height: 1.6rem;
    border-radius: 0.25rem;
    background: #43BFE3;
    opacity: 0.5;
}

.slider .thunk {
    position: absolute;
    left: 0.25rem;
    top: -0.35rem;
    width: 1rem;
    height: 1rem;
}

.slider .block {
    width: 0.5rem;
    height: 2rem;
    border: 0.1rem solid #43BFE3;
    background: #43BFE3;
    transition: .2s all;
    text-align: center;
    line-height: 2rem;
}

.slider .tips {
    position: absolute;
    left: -0.35rem;
    bottom: 1.5rem;
    min-width: 0.75rem;
    text-align: center;
    padding: 0.2rem 0.4rem;
    background: #ccc;
    border-radius: 0.25px;
    height: 1.2rem;
    color: #fff;
}

.slider .tips i {
    position: absolute;
    margin-left: -0.25rem;
    left: 50%;
    bottom: -0.45rem;
    font-size: 0.8rem;
    color: #000;
}

.slider .block:hover {
    transform: scale(1.1);
    opacity: .6;
}
</style>